import Company from "../models/Company.js";
import User from "../models/User.js";
import {
  createCompanySchema,
  updateCompanySchema,
  requestToJoinSchema,
  handleJoinRequestSchema,
  updateCompanyRoleSchema,
} from "../zodSchema/company.validation.js";
import { AppError } from "../utils/AppError.js";
import { catchAndWrap } from "../utils/catchAndWrap.js";
import mongoose from "mongoose";

export const createCompany = async (req, res) => {
  const parsedData = createCompanySchema.parse(req.body);
  const userId = req.user._id;

  // 1. Check if company name already exists
  const existingCompany = await Company.findOne({ name: parsedData.name });
  if (existingCompany) {
    throw new AppError("Company name already exists", 400);
  }

  // 2. Create the company and assign user as admin
  const company = await catchAndWrap(async () => {
    return await Company.create({
      ...parsedData,
      admins: [userId],
    });
  }, "Failed to create company");

  // 3. Update user's company field
  await catchAndWrap(async () => {
    await User.findByIdAndUpdate(userId, { company: company._id });
  }, "Failed to update user with company info");

  res.status(201).json({
    success: true,
    message: "Company created successfully",
    company,
  });
};

export const getAllCompanies = async (req, res) => {
  const { companyId } = req.params;

  if (companyId) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      throw new AppError("Invalid company ID", 400);
    }

    const company = await catchAndWrap(
      () => Company.findById(companyId),
      "Failed to fetch company",
      500
    );

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    return res.status(200).json({
      success: true,
      company,
    });
  }

  const filter = buildCompanyQuery(req.query);

  const companies = await catchAndWrap(
    () => Company.find(filter).select("-joinRequests"),
    "Failed to fetch companies",
    500
  );

  res.status(200).json({
    success: true,
    companies,
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
    await user.save();
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
