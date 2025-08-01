import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Info, Star, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api from "@/lib/axios";
import useAuthStore from "@/store/userStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsPage = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAModal, setTwoFAModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();
  const { logout, autoSendStatusEmail, setAutoSendStatusEmail, user } =
    useAuthStore();

  // Fetch 2FA status on mount (optional: can be from userStore if persisted)
  React.useEffect(() => {
    api.get("/auth/me").then((res) => {
      setTwoFAEnabled(res.data.twoFactorEnabled);
    });
  }, []);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/profile/delete", { data: { password } });
      toast.success("Account deleted successfully.");
      logout();
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setPassword("");
    }
  };

  const handleEnable2FA = async () => {
    setOtpLoading(true);
    try {
      await api.post("/auth/enable-2fa");
      setTwoFAModal(true);
      toast.info("OTP sent to your email. Enter it to enable 2FA.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
      setTwoFAEnabled(false);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    setOtpLoading(true);
    try {
      await api.post("/auth/verify-2fa", { otp });
      setTwoFAEnabled(true);
      setTwoFAModal(false);
      setOtp("");
      toast.success("Two-factor authentication enabled!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      const res = await api.patch("/auth/me", { role: newRole });
      toast.success(`Role changed to ${newRole}`);
      
      // Update the user in the store with the backend response
      useAuthStore.getState().setUser(res.data);
      
      // Navigate to the appropriate dashboard based on the new role
      if (newRole === "candidate") {
        navigate("/candidate/home");
      } else if (newRole === "recruiter") {
        // Check if user has a company association
        const hasCompany = res.data.company || useCompanyStore.getState().companyId;
        if (hasCompany) {
          // User has a company, go to dashboard
          navigate("/recruiter/dashboard");
        } else {
          // No company, go to company choice
          navigate("/recruiter/company-choice");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change role.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <ul className="mb-8">
        {/* Role change dropdown */}
        <li className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50 mb-2">
          <span className="flex items-center gap-2 text-gray-800 font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4m0 0c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2z" />
            </svg>
            Change Global Role
          </span>
          <Select
            value={user?.role}
            onValueChange={handleRoleChange}
            disabled={
              !user || (user.role !== "candidate" && user.role !== "recruiter")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {user?.role === "candidate" && (
                <SelectItem value="recruiter">Recruiter</SelectItem>
              )}
              {user?.role === "recruiter" && (
                <SelectItem value="candidate">Candidate</SelectItem>
              )}
            </SelectContent>
          </Select>
        </li>
        {user?.role === "recruiter" && (
          <li className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50 mb-2">
            <span className="flex items-center gap-2 text-gray-800 font-medium">
              <Mail className="w-5 h-5" /> Auto-send email on application status
              update
            </span>
            <Switch
              checked={autoSendStatusEmail}
              onCheckedChange={setAutoSendStatusEmail}
              id="auto-send-email-toggle"
            />
          </li>
        )}
        <li className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50 mb-2">
          <span className="flex items-center gap-2 text-gray-800 font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4m0 0c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2z" />
            </svg>
            Two-factor authentication (2FA)
          </span>
          <Switch
            checked={twoFAEnabled}
            onCheckedChange={async (checked) => {
              if (checked) {
                handleEnable2FA();
              } else {
                setOtpLoading(true);
                try {
                  await api.post("/auth/disable-2fa");
                  setTwoFAEnabled(false);
                  toast.success("Two-factor authentication disabled.");
                } catch (error) {
                  toast.error(
                    error.response?.data?.message || "Failed to disable 2FA."
                  );
                  setTwoFAEnabled(true);
                } finally {
                  setOtpLoading(false);
                }
              }
            }}
            id="2fa-toggle"
            disabled={otpLoading}
          />
        </li>
        <li className="flex items-center justify-between gap-4 p-4 rounded-lg border border-red-100 bg-red-50/40 mb-2">
          <span className="flex items-center gap-2 text-red-600 font-semibold">
            <Trash2 className="w-5 h-5" /> Delete Account
          </span>
          <Button
            variant="outline"
            className="border border-red-600 text-red-600 bg-transparent hover:bg-red-50 hover:text-red-700 hover:border-red-700 transition-colors px-4 py-2 font-semibold"
            onClick={() => setDeleteOpen(true)}
            style={{ boxShadow: "none" }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </li>
      </ul>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-6">More</h2>
        <div className="flex gap-6 justify-start mb-12">
          <Link
            to="/about"
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors group min-w-[100px]"
          >
            <Info className="w-7 h-7 text-black group-hover:text-gray-800 transition-colors" />
            <span className="text-base text-black font-medium group-hover:text-gray-800">
              About
            </span>
          </Link>
          <Link
            to="/features"
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors group min-w-[100px]"
          >
            <Star className="w-7 h-7 text-black group-hover:text-gray-800 transition-colors" />
            <span className="text-base text-black font-medium group-hover:text-gray-800">
              Features
            </span>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors group min-w-[100px]"
          >
            <Mail className="w-7 h-7 text-black group-hover:text-gray-800 transition-colors" />
            <span className="text-base text-black font-medium group-hover:text-gray-800">
              Contact
            </span>
          </Link>
        </div>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account? This action cannot
                be undone.
                <br />
                {
                  "If you are an admin, your company, jobs, and articles will also be deleted."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm your password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={deleting}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleting || !password}
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={twoFAModal} onOpenChange={setTwoFAModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter OTP</DialogTitle>
              <DialogDescription>
                Enter the 6-digit code sent to your email to enable 2FA.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                disabled={otpLoading}
                className="w-full text-center tracking-widest text-lg font-mono"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setTwoFAModal(false)}
                disabled={otpLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerify2FA}
                disabled={otpLoading || otp.length !== 6}
              >
                {otpLoading ? "Verifying..." : "Verify"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SettingsPage;
