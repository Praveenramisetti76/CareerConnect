import mongoose from "mongoose";

const { Schema, model } = mongoose;

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    industry: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },

    location: {
      type: String,
    },

    website: {
      type: String,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    foundedYear: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear(),
    },

    description: {
      type: String,
    },

    logo: String,
    logoPublicId: String,
    coverImage: String,
    coverImagePublicId: String,

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    specialties: [
      {
        type: String,
        trim: true,
      },
    ],

    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    // Roles with permissions
    roles: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          enum: ["admin", "recruiter", "employee"],
        },
      },
    ],

    // Auto-created users on company creation
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Members array for robust role tracking
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: ["admin", "recruiter", "employee"],
          required: true,
        },
      },
    ],

    joinRequests: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        roleTitle: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        requestedAt: { type: Date, default: Date.now },
      },
    ],

    jobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);
export default Company;
