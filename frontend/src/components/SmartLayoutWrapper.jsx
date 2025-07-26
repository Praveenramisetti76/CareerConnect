import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import RecruiterLayout from "@/layouts/RecruiterLayout";
import SidebarOnlyLayout from "@/layouts/SidebarOnlyLayout";
import CandidateLayout from "@/layouts/CandidateLayout";

const SmartLayoutWrapper = ({ children, requiresRecruiterRole = false }) => {
  const { user } = useAuthStore();
  const { companyRole, companyData } = useCompanyStore();

  // Debug logging
  // console.log("SmartLayoutWrapper Debug:", {
  //   userRole: user?.role,
  //   companyRole,
  //   companyData: !!companyData,
  //   hasCompany: !!user?.company,
  //   requiresRecruiterRole,
  //   pathname: window.location.pathname,
  //   userCompany: user?.company,
  //   userCompanyRole: user?.companyRole,
  // });

  // If this page requires recruiter role but user has employee role, redirect to candidate equivalent
  if (
    requiresRecruiterRole &&
    (companyRole === "employee" || user?.companyRole === "employee")
  ) {
    // console.log(
    //   " SmartLayoutWrapper: Employee trying to access recruiter-only page, redirecting"
    // );
    return <Navigate to="/candidate/home" replace />;
  }

  // If user is a recruiter but has company role as "employee", use CandidateLayout
  if (
    user?.role === "recruiter" &&
    (companyRole === "employee" || user?.companyRole === "employee")
  ) {
    // console.log(
    //   " SmartLayoutWrapper: Recruiter with employee role -> CandidateLayout"
    // );
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
    // console.log(
    //   "🎨 SmartLayoutWrapper: Recruiter with admin/recruiter role -> SidebarOnlyLayout"
    // );
    return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>;
  }

  // If user is a recruiter with recruiter company role or no company role yet, use RecruiterLayout (fallback)
  if (user?.role === "recruiter") {
    console.log(" SmartLayoutWrapper: Recruiter -> RecruiterLayout");
    return <RecruiterLayout>{children}</RecruiterLayout>;
  }

  // Default to CandidateLayout for candidates or any other case
  console.log(" SmartLayoutWrapper: Default -> CandidateLayout");
  return <CandidateLayout>{children}</CandidateLayout>;
};

export default SmartLayoutWrapper;
