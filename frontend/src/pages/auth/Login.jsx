import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/validation/auth.validation";
import { useState, useEffect } from "react";

const Login = () => {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingLogin, setPendingLogin] = useState({ email: "", password: "" });
  const [otpLoading, setOtpLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log("[MUTATION] Called with data:", data);
      // Always use the data argument for email, password, and otp
      if (data.otp) {
        setOtpLoading(true);
        console.log("[MUTATION] Sending login with OTP:", {
          email: data.email,
          password: data.password,
          otp: data.otp,
        });
        const result = await login(data.email, data.password, data.otp);
        setOtpLoading(false);
        console.log("[MUTATION] Login result (OTP):", result);
        return result;
      } else {
        console.log("[MUTATION] Sending login without OTP:", {
          email: data.email,
          password: data.password,
        });
        const result = await login(data.email, data.password);
        console.log("[MUTATION] Login result (no OTP):", result);
        return result;
      }
    },

    onSuccess: (result, variables) => {
      // If backend still returns twoFactorRequired even after OTP is sent, show error and do not loop
      if (result?.twoFactorRequired) {
        if (variables.otp) {
          // User submitted OTP but backend still wants OTP: show error
          toast.error("Invalid or expired OTP. Please try again.");
          setOtp("");
          setOtpLoading(false);
          return;
        } else {
          setShowOtp(true);
          setPendingLogin({ email: result.email, password: result.password });
          toast.info("OTP sent to your email. Enter it to complete login.");
          return;
        }
      }
      if (!result?.user) return; // Only proceed if user is present
      console.log("🚀 Login Component: Login successful, result:", result);
      toast.success("Login Successful");

      // Get the latest user and company data
      const user = result.user;
      const { companyId } = useCompanyStore.getState();

      // Determine where to navigate based on user role and company status
      let destination = "/dashboard";

      if (user.role === "recruiter") {
        // Check if recruiter has company association
        const hasCompany = companyId || user.company;
        destination = hasCompany
          ? "/recruiter/dashboard"
          : "/recruiter/company-choice";
      } else if (user.role === "candidate") {
        destination = "/candidate/home";
      }

      // Check if the redirect location is compatible with user role
      const from = location.state?.from;
      let finalDestination = destination; // Default to role-based destination

      if (from && typeof from === "string") {
        // Only use the redirect location if it's compatible with the user's role
        const isRoleCompatible =
          (user.role === "candidate" &&
            (from.startsWith("/candidate") ||
              from === "/dashboard" ||
              from.startsWith("/profile") ||
              from.startsWith("/job/"))) ||
          (user.role === "recruiter" &&
            (from.startsWith("/recruiter") ||
              from === "/dashboard" ||
              from.startsWith("/profile") ||
              from.startsWith("/jobs")));

        if (isRoleCompatible) {
          finalDestination = from;
        }
      }

      console.log("🚀 Login Component: Navigation details:", {
        userRole: user.role,
        companyId,
        hasCompany: !!(companyId || user.company),
        destination,
        from,
        fromType: typeof from,
        isRoleCompatible:
          from && typeof from === "string"
            ? (user.role === "candidate" &&
                (from.startsWith("/candidate") ||
                  from === "/dashboard" ||
                  from.startsWith("/profile") ||
                  from.startsWith("/job/"))) ||
              (user.role === "recruiter" &&
                (from.startsWith("/recruiter") ||
                  from === "/dashboard" ||
                  from.startsWith("/profile") ||
                  from.startsWith("/jobs")))
            : "N/A",
        finalDestination,
      });

      navigate(finalDestination, { replace: true });
    },
    onError: (error) => {
      console.error("Login error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Login Failed. Please check your credentials.";
      toast.error(errorMessage);
      // If OTP error, reset OTP state so user can retry
      if (
        errorMessage.toLowerCase().includes("otp") ||
        errorMessage.toLowerCase().includes("expired")
      ) {
        setOtp("");
        setOtpLoading(false);
      }
    },
  });

  const onSubmit = (data) => {
    console.log(
      "[onSubmit] called. showOtp:",
      showOtp,
      "pendingLogin:",
      pendingLogin,
      "otp:",
      otp,
      "data:",
      data
    );
    if (showOtp && pendingLogin.email && pendingLogin.password) {
      const payload = { ...pendingLogin, otp };
      console.log("[onSubmit] Submitting OTP verification payload:", payload);
      mutation.mutate(payload);
    } else {
      console.log("[onSubmit] Submitting login payload:", data);
      mutation.mutate(data);
    }
  };

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
           {" "}
      <div className="layout-content-container flex flex-col w-full max-w-[512px] py-5">
               {" "}
        <h2 className="text-[#111418] text-[28px] font-bold leading-tight text-center pb-3 pt-5">
                    Join CareerConnect        {" "}
        </h2>
               {" "}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                   {" "}
          <div className="px-4">
                       {" "}
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="bg-[#f0f2f5] h-14 text-[#111418] placeholder:text-[#60758a] text-base"
              disabled={showOtp}
            />
                       {" "}
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
                     {" "}
          </div>
                   {" "}
          <div className="px-4">
                       {" "}
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="bg-[#f0f2f5] h-14 text-[#111418] placeholder:text-[#60758a] text-base"
              disabled={showOtp}
            />
                       {" "}
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
                     {" "}
          </div>
          {showOtp && (
            <div className="px-4 flex flex-col items-center gap-2">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="bg-[#f0f2f5] h-14 text-[#111418] placeholder:text-[#60758a] text-base text-center tracking-widest text-lg font-mono"
                autoFocus
                disabled={otpLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Check your email for a 6-digit code.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-2 text-xs px-3 py-1"
                disabled={
                  otpLoading ||
                  !pendingLogin.email ||
                  !pendingLogin.password ||
                  cooldown > 0
                }
                onClick={() => {
                  if (!pendingLogin.email || !pendingLogin.password) {
                    toast.error("No login info to resend OTP.");
                    return;
                  }
                  mutation.mutate({
                    email: pendingLogin.email,
                    password: pendingLogin.password,
                  });
                  toast.info("OTP resent to your email.");
                  setCooldown(45);
                }}
              >
                {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
              </Button>
            </div>
          )}
                   {" "}
          <div className="px-4">
                       {" "}
            <Button
              type="submit"
              className="w-full bg-[#0c7ff2] hover:bg-[#0a6fd0] h-10 text-sm font-bold"
              disabled={mutation.isPending || (showOtp && otp.length !== 6)}
            >
                           {" "}
              {showOtp
                ? otpLoading
                  ? "Verifying..."
                  : "Verify OTP"
                : "Sign in"}{" "}
                         {" "}
            </Button>
                     {" "}
          </div>
                 {" "}
        </form>
               {" "}
        <div className="px-4 text-center pt-2">
          <p
            className="text-[#0c7ff2] text-sm cursor-pointer hover:underline"
            onClick={() => navigate("/auth/forgot-password")}
          >
            Forgot your password?
          </p>
        </div>{" "}
        <p className="text-[#60758a] text-sm text-center px-4 pt-3">Or</p>     
         {" "}
        <p
          className="text-[#60758a] text-sm text-center px-4 pt-3 underline cursor-pointer"
          onClick={() => navigate("/signup")}
        >
                    New to CareerConnect? Create an account{" "}
        </p>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default Login;
