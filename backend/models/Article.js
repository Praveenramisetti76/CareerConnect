import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorType: {
      type: String,
      enum: ["user", "company"],
      required: true,
    },
    author: {
      type: Types.ObjectId,
      required: true,
      refPath: "authorType",
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Article = model("Article", articleSchema);
export default Article;
