import express from "express";
import { authentication } from "../middleware/auth.js";
import { checkCompanyRole } from "../middleware/companyRole.js";
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  requestToJoinCompany,
  getJoinRequests,
  handleJoinRequest,
  updateCompanyRole,
  removeMemberFromCompany,
  getCompanyMembers,
} from "../controllers/company.controller.js";
import { role } from "../middleware/role.js";

const router = express.Router();

router.use(authentication);

router.get("/all", getAllCompanies);
router.get("/:companyId", getAllCompanies);

router.post("/create", role("recruiter"), createCompany);

router.put("/update/:companyId", checkCompanyRole("admin"), updateCompany);
router.delete("/delete/:companyId", checkCompanyRole("admin"), deleteCompany);

router.post("/:companyId/request", requestToJoinCompany);
router.get(
  "/:companyId/requests",
  checkCompanyRole("admin", "recruiter"),
  getJoinRequests
);
router.put(
  "/:companyId/requests/:requestId",
  checkCompanyRole("admin", "recruiter"),
  handleJoinRequest
);

router.put(
  "/:companyId/roles/:userId",
  checkCompanyRole("admin", "recruiter"),
  updateCompanyRole
);
router.delete(
  "/:companyId/roles/:userId",
  checkCompanyRole("admin", "recruiter"),
  removeMemberFromCompany
);

router.get(
  "/:companyId/members",
  checkCompanyRole("admin", "recruiter"),
  getCompanyMembers
);

export default router;
