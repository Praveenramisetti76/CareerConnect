import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signupSchema } from "@/validation/auth.validation";
import { verifySignup2FA } from "@/api/articleApi";
import { useState, useEffect } from "react";

const Signup = () => {
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(signupSchema) });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const result = await signup(
        data.name,
        data.email,
        data.password,
        data.role
      );
      return result;
    },

    onSuccess: async (result, variables) => {
      if (result?.twoFactorRequired) {
        setShowOtp(true);
        setPendingUserId(result.userId);
        setPendingSignupData(variables);
        toast.info("OTP sent to your email. Enter it to complete registration.");
        return;
      }
      toast.success("Signup Successful");

      // Get the user data from the result or store
      const user = useAuthStore.getState().user;
      const { companyId } = useCompanyStore.getState();

      // Navigate based on role and company status
      if (user?.role === "recruiter") {
        const hasCompany = companyId || user.company;
        const destination = hasCompany
          ? "/recruiter/dashboard"
          : "/recruiter/company-choice";
        navigate(destination);
      } else if (user?.role === "candidate") {
        navigate("/candidate/home");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      console.error("Signup error:", error);
      const errorMessage = error?.response?.data?.message || "Signup Failed";
      toast.error(errorMessage);
    },
  });

  const otpMutation = useMutation({
    mutationFn: async ({ userId, otp }) => {
      setOtpLoading(true);
      const result = await verifySignup2FA(userId, otp);
      setOtpLoading(false);
      return result;
    },
    onSuccess: (result) => {
      toast.success("Signup Successful");
      setShowOtp(false);
      // Set token and user in store after OTP verification
      useAuthStore.getState().setToken(result.token);
      useAuthStore.getState().setUser(result.user);
      // Optionally, set isInitialized to true
      // useAuthStore.getState().setInitialized(true);
      const user = result.user;
      const { companyId } = useCompanyStore.getState();
      if (user?.role === "recruiter") {
        const hasCompany = companyId || user.company;
        const destination = hasCompany
          ? "/recruiter/dashboard"
          : "/recruiter/company-choice";
        navigate(destination);
      } else if (user?.role === "candidate") {
        navigate("/candidate/home");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      setOtpLoading(false);
      toast.error(error?.response?.data?.message || "Invalid OTP");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const onOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp || !pendingUserId) {
      toast.error("Enter the OTP to verify");
      return;
    }
    otpMutation.mutate({ userId: pendingUserId, otp });
  };

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  // Debounce cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  return (
    <div className=" px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-full max-w-[512px] py-5 flex-1">
        <h2 className="text-[#111518] text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          Create your account
        </h2>

        {showOtp ? (
          <form onSubmit={onOtpSubmit} className="space-y-4">
            <div className="px-4">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                className="bg-[#f0f2f5] h-14 text-[#111418] placeholder:text-[#60758a] text-base text-center tracking-widest text-lg font-mono"
                autoFocus
                disabled={otpLoading}
              />
              <p className="text-xs text-gray-500 mt-2">Check your email for a 6-digit code.</p>
              <Button
                type="button"
                variant="outline"
                className="mt-2 text-xs px-3 py-1"
                disabled={otpLoading || cooldown > 0 || !pendingSignupData}
                onClick={() => {
                  if (!pendingSignupData) {
                    toast.error("No signup info to resend OTP.");
                    return;
                  }
                  mutation.mutate(pendingSignupData);
                  toast.info("OTP resent to your email.");
                  setCooldown(45);
                }}
              >
                {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
              </Button>
            </div>
            <div className="px-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-[#cedfed] text-[#111518] font-bold"
                disabled={otpLoading || otp.length !== 6}
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="px-4">
              <label className="text-[#111518] text-base font-medium leading-normal pb-2 block">
                Full name
              </label>
              <Input
                placeholder="Enter your full name"
                {...register("name")}
                className="h-14 bg-gray-50 border-[#d5dce2] placeholder:text-[#5d7589]"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="px-4">
              <label className="text-[#111518] text-base font-medium leading-normal pb-2 block">
                Email
              </label>
              <Input
                placeholder="Enter your email"
                {...register("email")}
                className="h-14 bg-gray-50 border-[#d5dce2] placeholder:text-[#5d7589]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="px-4">
              <label className="text-[#111518] text-base font-medium leading-normal pb-2 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className="h-14 bg-gray-50 border-[#d5dce2] placeholder:text-[#5d7589]"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="px-4">
              <label className="text-[#111518] text-base font-medium leading-normal pb-2 block">
                Role
              </label>
              <Select onValueChange={(value) => setValue("role", value)}>
                <SelectTrigger className="h-14 bg-gray-50 border-[#d5dce2] text-left">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="candidate">Candidate</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="px-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-[#cedfed] text-[#111518] font-bold"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create account"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
