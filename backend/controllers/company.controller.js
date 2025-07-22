import { cloudinary } from "../config/cloudinary.js";
import { buildCompanyQuery } from "../utils/queryOperations/companyOptions.js";
import User from "../models/User.js";
import {
  createCompanySchema,
  updateCompanySchema,
  requestToJoinSchema,
  handleJoinRequestSchema,
  updateCompanyRoleSchema,
  getMyCompanyRoleSchema,
} from "../zodSchema/company.validation.js";
import { AppError } from "../utils/AppError.js";
import { catchAndWrap } from "../utils/catchAndWrap.js";
import mongoose from "mongoose";
import Company from "../models/Company.js";



export const getMyCompany = async (req, res, next) => {
    const user = req.user;
    if (!user.company) {
      return res.json({});
    }
    const company = await catchAndWrap(Company.findById(user.company));
    if (!company) {
      return res.json({});
    }
    res.json(company);
};

export const searchCompaniesByName = async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    throw new AppError("Query too short", 400);
  }

  const results = await catchAndWrap(
    () => Company.find({ name: new RegExp(q, "i") }).select("_id name logo").limit(10),
    "Company search failed"
  );

  res.json(results);
};

export const getMyCompanyRole = async (req, res) => {
  const parsed = getMyCompanyRoleSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError("Validation falied", 400, parsed.error.errors);
  }
  const { id: companyId } = parsed.data;
  const userId = req.user._id;

  const company = await catchAndWrap(
    () => Company.findById(companyId),
    "Failed to fetch company"
  );

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  // Defensive: ensure members array exists
  if (!Array.isArray(company.members)) {
    return res.status(404).json({ message: "Company members not found" });
  }

  const member = company.members.find(
    (m) => m.user.toString() === userId.toString()
  );

  if (!member) {
    throw new AppError("You are not a member of this company", 403);
  }

  res.status(200).json({ role: member.role });
};

export const createCompany = async (req, res) => {
  // console.log("REQ BODY", req.body);
  // console.log("REQ HEADERS", req.headers);
  // console.log("REQ FILES", req.files);

  // Parse socialLinks if sent as FormData fields
  let parsedBody = { ...req.body };
  if (parsedBody["socialLinks[linkedin]"] || parsedBody["socialLinks[twitter]"] || parsedBody["socialLinks[github]"]) {
    parsedBody.socialLinks = {
      linkedin: parsedBody["socialLinks[linkedin]"] || "",
      twitter: parsedBody["socialLinks[twitter]"] || "",
      github: parsedBody["socialLinks[github]"] || "",
    };
  }

  const parsedData = createCompanySchema.parse(parsedBody);
  const userId = req.user._id;

  const existingCompany = await Company.findOne({ name: parsedData.name });
  if (existingCompany) {
    throw new AppError("Company name already exists", 400);
  }

  const company = await catchAndWrap(async () => {
    return await Company.create({
      ...parsedData,
      admins: [userId],
      members: [{ user: userId, role: "admin" }],
    });
  }, "Failed to create company");

  await catchAndWrap(async () => {
    await User.findByIdAndUpdate(userId, { company: company._id, companyRole: "admin" });
  }, "Failed to update user with company info");

  res.status(201).json({
    success: true,
    message: "Company created successfully",
    company,
  });
};

export const uploadCompanyLogo = async (req, res) => {
  console.log("REQ BODY upload company logo", req.body);
  console.log("REQ HEADERS upload company logo", req.headers);
  console.log("REQ FILES upload company logo", req.files);
  const { companyId } = req.params;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const company = await Company.findById(companyId);
  if (!company) return res.status(404).json({ error: "Company not found" });
  if (company.logoPublicId) {
    await cloudinary.uploader.destroy(company.logoPublicId);
  }
  console.log("UPLOAD LOGO FILE", req.file);
  company.logo = req.file.path;
  company.logoPublicId = req.file.public_id;
  await company.save();
  res.json({ success: true, logo: company.logo });
};

// Upload company cover image
export const uploadCompanyCover = async (req, res) => {
  const { companyId } = req.params;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const company = await Company.findById(companyId);
  if (!company) return res.status(404).json({ error: "Company not found" });
  if (company.coverImagePublicId) {
    await cloudinary.uploader.destroy(company.coverImagePublicId);
  }
  console.log("UPLOAD COVER FILE", req.file);
  company.coverImage = req.file.path;
  company.coverImagePublicId = req.file.public_id;
  await company.save();
  res.json({ success: true, coverImage: company.coverImage });
};

export const getAllCompanies = async (req, res) => {
  const filter = buildCompanyQuery(req.query);
  const sort = req.query.sort === "newest" ? { createdAt: -1 } : {};
  const limit = parseInt(req.query.limit) || 10;

  const companies = await catchAndWrap(
    () => Company.find(filter).select("-joinRequests").sort(sort).limit(limit),
    "Failed to fetch companies",
    500
  );

  res.status(200).json({
    success: true,
    companies,
  });
};



export const getCompanyById = async (req, res) => {
  const { companyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new AppError("Invalid company ID", 400);
  }

  const company = await catchAndWrap(
    () =>
      Company.findById(companyId)
        .populate("admins", "name email")
        .populate("members.user", "name email"),
    "Failed to fetch company",
    500
  );

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  // Optional: Strip sensitive fields or reshape if needed
  const companyData = {
    _id: company._id,
    name: company.name,
    industry: company.industry,
    size: company.size,
    location: company.location,
    website: company.website,
    foundedYear: company.foundedYear,
    description: company.description,
    logo: company.logo,
    logoPublicId: company.logoPublicId,
    coverImage: company.coverImage,
    coverImagePublicId: company.coverImagePublicId,
    socialLinks: company.socialLinks || {
      linkedin: "",
      twitter: "",
      github: "",
    },
    admins: company.admins,
    members: company.members,
  };

  res.status(200).json({
    success: true,
    company: companyData,
  });
};

export const updateCompany = async (req, res) => {
  const { companyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new AppError("Invalid company ID", 400);
  }

  const parsed = updateCompanySchema.safeParse(req.body);
  if (!parsed.success) {
    throw parsed.error;
  }

  const updatedCompany = await catchAndWrap(
    () =>
      Company.findByIdAndUpdate(companyId, parsed.data, {
        new: true,
        runValidators: true,
      }),
    "Failed to update company",
    500
  );

  if (!updatedCompany) {
    throw new AppError("Company not found", 404);
  }

  res.status(200).json({
    success: true,
    company: updatedCompany,
  });
};

export const deleteCompany = async (req, res) => {
  const { companyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new AppError("Invalid company ID", 400);
  }

  const deleted = await catchAndWrap(
    () => Company.findByIdAndDelete(companyId),
    "Failed to delete company",
    500
  );

  if (!deleted) {
    throw new AppError("Company not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Company deleted successfully",
  });
};

export const requestToJoinCompany = async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user._id;

  const parsed = requestToJoinSchema.safeParse(req.body);
  if (!parsed.success) throw parsed.error;

  const { roleTitle } = parsed.data;

  const company = await catchAndWrap(
    () => Company.findById(companyId),
    "Failed to fetch company",
    404
  );
  if (!company) throw new AppError("Company not found", 404);

  const existingRequest = company.joinRequests.find(
    (r) => r.user.toString() === userId.toString()
  );

  const alreadyMember =
    company.admins.includes(userId) ||
    (existingRequest && existingRequest.status === "accepted");

  if (alreadyMember) {
    throw new AppError("You're already part of this company", 400);
  }

  if (existingRequest && existingRequest.status === "pending") {
    throw new AppError("You already requested to join this company", 400);
  }

  company.joinRequests.push({
    user: userId,
    roleTitle,
    status: "pending",
  });

  await catchAndWrap(() => company.save(), "Failed to submit join request");

  res.status(200).json({
    success: true,
    message: "Join request submitted successfully",
  });
};

export const getJoinRequests = async (req, res) => {
  const { companyId } = req.params;

  const company = await catchAndWrap(
    async () =>
      await Company.findById(companyId)
        .populate("joinRequests.user", "name email")
        .lean(),
    "Failed to fetch company or requests",
    404
  );

  if (!company) throw new AppError("Company not found", 404);

  res.status(200).json({
    success: true,
    requests: company.joinRequests,
  });
};

export const handleJoinRequest = async (req, res, next) => {
  const { companyId, requestId } = req.params;
  const { status } = handleJoinRequestSchema.parse(req.body);

  const company = await catchAndWrap(
    () => Company.findById(companyId),
    "Company not found",
    404
  );

  const request = company.joinRequests.id(requestId);
  if (!request) throw new AppError("Join request not found", 404);
  if (request.status !== "pending") {
    throw new AppError("Request already processed", 400);
  }

  request.status = status;

  if (status === "accepted") {
    const user = await catchAndWrap(
      () => User.findById(request.user),
      "User not found",
      404
    );
    user.company = company._id;
    user.companyRole = request.roleTitle;
    await user.save();
    // Add to company members if not already present
    if (!company.members.some(m => m.user.toString() === user._id.toString())) {
      company.members.push({ user: user._id, role: request.roleTitle });
    }
  }

  await company.save();

  res.status(200).json({ success: true, message: `Request ${status}` });
};
export const updateCompanyRole = async (req, res) => {
  const { companyId, userId } = req.params;
  const { roleTitle } = updateCompanyRoleSchema.parse(req.body);

  // Don't allow promoting to owner unless you're already owner
  if (roleTitle === "admin" && req.companyRole !== "admin") {
    throw new AppError("Only an admin can assign ownership", 403);
  }

  const company = await catchAndWrap(
    () => Company.findById(companyId),
    "Failed to find company"
  );
  if (!company) throw new AppError("Company not found", 404);

  const joinRequest = company.joinRequests.find(
    (req) => req.user.toString() === userId && req.status === "accepted"
  );

  if (!joinRequest) {
    throw new AppError("User is not a valid company member", 404);
  }

  joinRequest.roleTitle = roleTitle;
  await catchAndWrap(() => company.save(), "Failed to update user role");

  res.status(200).json({
    success: true,
    message: `Updated role to '${roleTitle}'`,
  });
};

export const removeMemberFromCompany = async (req, res) => {
  const { companyId, userId } = req.params;

  if (req.user._id.toString() === userId) {
    throw new AppError("You cannot remove yourself", 400);
  }

  const company = await catchAndWrap(
    () => Company.findById(companyId),
    "Failed to find company"
  );
  if (!company) throw new AppError("Company not found", 404);

  const requestIndex = company.joinRequests.findIndex(
    (r) => r.user.toString() === userId && r.status === "accepted"
  );
  if (requestIndex === -1) {
    throw new AppError("User is not a member of the company", 404);
  }

  const userRequest = company.joinRequests[requestIndex];

  if (userRequest.roleTitle === "owner" && req.companyRole !== "owner") {
    throw new AppError("Only an owner can remove another owner", 403);
  }

  company.joinRequests.splice(requestIndex, 1);

  company.admins = company.admins.filter(
    (adminId) => adminId.toString() !== userId
  );

  await catchAndWrap(() => company.save(), "Failed to update company");

  const user = await User.findById(userId);
  if (user && user.company?.toString() === companyId) {
    user.company = null;
    user.companyRole = null;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
};

export const getCompanyMembers = async (req, res) => {
  const { companyId } = req.params;

  const company = await catchAndWrap(
    () => Company.findById(companyId),
    "Failed to fetch company"
  );

  if (!company) throw new AppError("Company not found", 404);

  const members = await catchAndWrap(
    () => User.find({ company: companyId }).select("name email role"),
    "Failed to fetch members"
  );

  res.status(200).json({
    success: true,
    count: members.length,
    members,
  });
};
