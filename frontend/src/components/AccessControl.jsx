import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/userStore";
import LodingScreen from "./LodingScreen";

const AccessControl = ({ children, auth = false, role, companyRole }) => {
  const { user, isInitialized, token } = useAuthStore();
  const location = useLocation();

  // Debug logging for access control
  // console.log(" AccessControl Debug:", {
  //   path: location.pathname,
  //   isInitialized,
  //   hasUser: !!user,
  //   userRole: user?.role,
  //   hasToken: !!token,
  //   requiredRole: role,
  //   requiredCompanyRole: companyRole,
  //   currentCompanyRole: user?.company?.role,
  //   user: user,
  // });

  // Wait for auth initialization to complete
  if (!isInitialized) {
    // console.log(
    //   "AccessControl: Auth not initialized, showing loading screen"
    // );
    return <LodingScreen />;
  }

  if (auth && !user) {
    // console.log(
    //   "AccessControl: Auth required but no user, redirecting to login"
    // );
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    // console.log("AccessControl: Role check:", {
    //   allowedRoles,
    //   userRole: user?.role,
    //   isAllowed: allowedRoles.includes(user?.role),
    // });

    if (!allowedRoles.includes(user?.role)) {
      // console.log(
      //   "AccessControl: Role not allowed, redirecting to unauthorized"
      // );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (companyRole) {
    const allowedCompanyRoles = Array.isArray(companyRole)
      ? companyRole
      : [companyRole];

    const currentCompanyRole = user?.company?.role;

    // console.log("AccessControl: Company role check:", {
    //   allowedCompanyRoles,
    //   currentCompanyRole,
    //   isAllowed:
    //     currentCompanyRole && allowedCompanyRoles.includes(currentCompanyRole),
    // });

    if (
      !currentCompanyRole ||
      !allowedCompanyRoles.includes(currentCompanyRole)
    ) {
      // console.log(
      //   "AccessControl: Company role not allowed, redirecting to unauthorized"
      // );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // console.log("AccessControl: Access granted, rendering children");
  return children;
};

export default AccessControl;
