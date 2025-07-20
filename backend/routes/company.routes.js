import express from "express";
import { authentication } from "../middleware/auth.js";
import { checkCompanyRole } from "../middleware/companyRole.js";
import { role } from "../middleware/role.js";
import Company from "../models/Company.js";
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
  uploadCompanyLogo,
  uploadCompanyCover,
} from "../controllers/company.controller.js";
import {
  uploadCompanyLogo as logoUpload,
  uploadCompanyCover as coverUpload,
} from "../middleware/multer.js";

const router = express.Router();

// Public: Get newest companies

router.use(authentication);
// Only admin can upload logo
router.patch(
  "/:companyId/logo",
  checkCompanyRole("admin"),
  logoUpload.single("logo"),
  uploadCompanyLogo
);

// Only admin can upload cover image
router.patch(
  "/:companyId/cover",
  checkCompanyRole("admin"),
  coverUpload.single("coverImage"),
  uploadCompanyCover
);

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

router.get("/my-company", role("recruiter"), async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.company) {
      return res.json({});
    }
    const company = await Company.findById(user.company);
    if (!company) {
      return res.json({});
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
});

export default router;
