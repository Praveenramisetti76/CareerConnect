import { Schema, model, Types, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  content: string;
  authorType: "user" | "company";
  author: Types.ObjectId;
  tags?: string[];
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorType: { type: String, enum: ["user", "company"], required: true },
    author: { type: Schema.Types.ObjectId, required: true, refPath: "authorType" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default model<IArticle>("Article", articleSchema);
