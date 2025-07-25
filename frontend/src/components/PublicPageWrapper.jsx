import React from "react";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import RecruiterLayout from "@/layouts/RecruiterLayout";
import SidebarOnlyLayout from "@/layouts/SidebarOnlyLayout";
import CandidateLayout from "@/layouts/CandidateLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Navbar from "@/components/Navbar";

const PublicPageWrapper = ({ children }) => {
  const { user } = useAuthStore();
  const { companyRole } = useCompanyStore();
  const location = window.location.pathname;
  // Always show Navbar for homepage route
  if (location === "/") {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  // If user is not authenticated, use AuthLayout (navbar only)
  if (!user) {
    return <AuthLayout>{children}</AuthLayout>;
  }
  if (
    user?.role === "recruiter" &&
    (companyRole === "employee" || user?.companyRole === "employee")
  ) {
    return <CandidateLayout>{children}</CandidateLayout>;
  }
  if (
    user?.role === "recruiter" &&
    (companyRole === "admin" ||
      companyRole === "recruiter" ||
      user?.companyRole === "admin" ||
      user?.companyRole === "recruiter")
  ) {
    return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>;
  }
  if (user?.role === "recruiter") {
    return <RecruiterLayout>{children}</RecruiterLayout>;
  }
  return <CandidateLayout>{children}</CandidateLayout>;
};

export default PublicPageWrapper;
