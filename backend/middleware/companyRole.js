import Company from "../models/Company.js";
import { AppError } from "../utils/AppError.js";
import { catchAndWrap } from "../utils/catchAndWrap.js";

export const checkCompanyRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { companyId } = req.params;

      if (!companyId) {
        throw new AppError("Company ID is required", 400);
      }

      // Use catchAndWrap only for database operation
      const company = await catchAndWrap(
        async () => Company.findById(companyId),
        "Failed to fetch company data",
        500
      );

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      // console.log("User ID:", userId.toString());
      // console.log("Company admins:", company.admins.map(id => id.toString()));
      // console.log("Join requests:", company.joinRequests);

      const isAdmin = company.admins.some(
        (adminId) => adminId.toString() === userId.toString()
      );

      const userRequest = company.joinRequests.find(
        (req) =>
          req.user.toString() === userId.toString() && req.status === "accepted"
      );

      // console.log("isAdmin:", isAdmin);
      // console.log("userRequest:", userRequest);

      let userRole = null;
      if (isAdmin) {
        userRole = "admin";
      } else if (userRequest) {
        userRole = userRequest.roleTitle;
      }

      // console.log("userRole:", userRole);
      // console.log("allowedRoles:", allowedRoles);

      if (!userRole) {
        throw new AppError("User is not a member of this company", 403);
      }

      if (!allowedRoles.includes(userRole)) {
        throw new AppError(
          `Forbidden: Role '${userRole}' is not authorized. Required roles: ${allowedRoles.join(
            ", "
          )}`,
          403
        );
      }

      req.companyRole = userRole;
      next();
    } catch (error) {
      next(error);
    }
  };
};
