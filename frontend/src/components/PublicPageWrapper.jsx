import React from "react";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import RecruiterLayout from "@/layouts/RecruiterLayout";
import SidebarOnlyLayout from "@/layouts/SidebarOnlyLayout";
import CandidateLayout from "@/layouts/CandidateLayout";
import AuthLayout from "@/layouts/AuthLayout";

const PublicPageWrapper = ({ children }) => {
  const { user } = useAuthStore();
  const { companyRole } = useCompanyStore();

  // Debug logging
  console.log("🌐 PublicPageWrapper Debug:", {
    isAuthenticated: !!user,
    userRole: user?.role,
    companyRole,
    userCompanyRole: user?.companyRole,
    pathname: window.location.pathname,
  });

  // If user is not authenticated, use AuthLayout (navbar only)
  if (!user) {
    console.log("🌐 PublicPageWrapper: Unauthenticated -> AuthLayout");
    return <AuthLayout>{children}</AuthLayout>;
  }

  // If user is a recruiter with employee role, use CandidateLayout
  if (
    user?.role === "recruiter" &&
    (companyRole === "employee" || user?.companyRole === "employee")
  ) {
    console.log(
      "🌐 PublicPageWrapper: Recruiter with employee role -> CandidateLayout"
    );
    return <CandidateLayout>{children}</CandidateLayout>;
  }

  // If user is a recruiter with admin or recruiter company role, use SidebarOnlyLayout
  if (
    user?.role === "recruiter" &&
    (companyRole === "admin" ||
      companyRole === "recruiter" ||
      user?.companyRole === "admin" ||
      user?.companyRole === "recruiter")
  ) {
    console.log(
      "🌐 PublicPageWrapper: Recruiter with admin/recruiter role -> SidebarOnlyLayout"
    );
    return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>;
  }

  // If user is a recruiter (fallback case), use RecruiterLayout
  if (user?.role === "recruiter") {
    console.log("🌐 PublicPageWrapper: Recruiter -> RecruiterLayout");
    return <RecruiterLayout>{children}</RecruiterLayout>;
  }

  // Default to CandidateLayout for candidates
  console.log("🌐 PublicPageWrapper: Candidate -> CandidateLayout");
  return <CandidateLayout>{children}</CandidateLayout>;
};

export default PublicPageWrapper;
