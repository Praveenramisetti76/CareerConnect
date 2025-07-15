import { Schema, model, Types, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  company: Types.ObjectId;
  postedBy: Types.ObjectId;
  salaryRange?: string;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      required: true,
    },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    salaryRange: { type: String },
  },
  { timestamps: true }
);

export default model<IJob>("Job", jobSchema);
