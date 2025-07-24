import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Interview Tips",
        "Resume Writing",
        "Career Development",
        "Industry Trends",
        "Job Search",
        "Networking",
        "Professional Skills",
        "Workplace Culture",
        "General",
      ],
      default: "General",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    featuredImage: {
      type: String,
    },
    summary: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    authorType: {
      type: String,
      required: true,
      enum: ["User", "Company"],
    },
    author: {
      type: Types.ObjectId,
      required: true,
      refPath: "authorType",
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

articleSchema.index({ tags: 1 });

// Set publishedAt when status changes to published
articleSchema.pre("save", function (next) {
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Article = model("Article", articleSchema);
export default Article;
