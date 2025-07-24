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

    onSuccess: (result) => {
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

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className=" px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-full max-w-[512px] py-5 flex-1">
        <h2 className="text-[#111518] text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          Create your account
        </h2>

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
      </div>
    </div>
  );
};

export default Signup;
