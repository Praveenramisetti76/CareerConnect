import express from "express";
import { authentication } from "../../middleware/auth.js";
import { checkCompanyRole } from "../../middleware/companyRole.js";
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
} from "../../controllers/recruiter/company.controller.js";
import { role } from "../../middleware/role.js";

const router = express.Router();

router.use(authentication);

// ───── Public or general access ─────
router.get("/all", getAllCompanies); // Optional: list/search companies
router.get("/:companyId", getAllCompanies);

// ───── Create Company ─────
router.post("/create", role("recruiter") ,createCompany); // recruiter only (checked inside controller via user.role)

// ───── Update / Delete Company ─────
router.put("/update/:companyId", checkCompanyRole("admin"), updateCompany);
router.delete("/delete/:companyId", checkCompanyRole("admin"), deleteCompany);

// ───── Join Requests ─────
router.post("/:companyId/request", requestToJoinCompany); // anyone can send
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

// ───── Role Management ─────
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

// ───── Company Members ─────
router.get(
  "/:companyId/members",
  checkCompanyRole("admin", "recruiter"),
  getCompanyMembers
);

export default router;
