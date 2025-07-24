import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import api from "@/lib/axios";

// Check if user's join request status has changed
const checkJoinRequestStatus = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useJoinRequestStatusChecker = () => {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuthStore();
  const { companyId, companyRole } = useCompanyStore();

  // Only run this check if user is a recruiter but doesn't have a company association
  // This indicates they might have a pending join request
  const shouldCheck = user?.role === "recruiter" && !companyId;

  console.log("🔍 Status Checker - Should check:", shouldCheck, {
    userRole: user?.role,
    companyId,
    companyRole,
  });

  const { data: latestUserData } = useQuery({
    queryKey: ["joinRequestStatus", user?._id],
    queryFn: checkJoinRequestStatus,
    enabled: shouldCheck,
    refetchInterval: shouldCheck ? 10000 : false, // Check every 10 seconds (more frequent)
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (latestUserData && shouldCheck) {
      console.log("🔍 Status Checker - Latest user data:", {
        hasCompany: !!latestUserData.company,
        companyRole: latestUserData.companyRole,
        currentCompanyId: companyId,
      });

      // Check if user now has company association (join request was accepted)
      if (latestUserData.company && latestUserData.companyRole) {
        console.log(
          "🎉 Status Checker - User got accepted! Refreshing data..."
        );

        // Show success toast notification
        toast.success(
          `🎉 Welcome to ${latestUserData.company.name}! Your join request has been accepted.`,
          {
            duration: 5000,
            description: `You've been added as ${
              latestUserData.companyRole === "employee"
                ? "an employee"
                : "a recruiter"
            }.`,
          }
        );

        // Refresh the user data in the store
        refreshUserData();

        // Redirect to appropriate dashboard based on role
        if (latestUserData.companyRole === "employee") {
          console.log(
            "🎉 Status Checker - Redirecting employee to dashboard..."
          );
          navigate("/recruiter/dashboard");
        } else {
          console.log(
            "🎉 Status Checker - Redirecting recruiter/admin to dashboard..."
          );
          navigate("/recruiter/dashboard");
        }
      }
    }
  }, [latestUserData, shouldCheck, refreshUserData, companyId, navigate]);

  return { shouldCheck };
};
