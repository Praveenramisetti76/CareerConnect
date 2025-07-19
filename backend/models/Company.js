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
      required: true,
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
        permissions: {
          type: [String],
          default: [],
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

// Default roles with permissions (can be initialized at company creation)
companySchema.statics.defaultRoles = [
  {
    title: "admin",
    permissions: [
      "accept_recruiter",
      "remove_recruiter",
      "accept_employee",
      "remove_employee",
      "accept_admin",
      "remove_admin",
    ],
  },
  {
    title: "recruiter",
    permissions: [
      "accept_recruiter",
      "remove_recruiter",
      "accept_employee",
      "remove_employee",
    ],
  },
  {
    title: "employee",
    permissions: [],
  },
];

const company = model("company", companySchema);
export default company;
