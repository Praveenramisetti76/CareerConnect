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
    authorType: {
      type: String,
      required: true,
      enum: ["user", "company"],
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
  },
  { timestamps: true }
);

articleSchema.index({ tags: 1 });

const Article = model("Article", articleSchema);
export default Article;
