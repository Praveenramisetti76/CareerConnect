import { Schema, model, Types, Document } from "mongoose";

export interface IApplication extends Document {
  job: Types.ObjectId;
  user: Types.ObjectId;
  resume: string;
  coverLetter?: string;
  status: "applied" | "reviewed" | "interview" | "hired" | "rejected";
}

const applicationSchema = new Schema<IApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String, required: true },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ["applied", "reviewed", "interview", "hired", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

export default model<IApplication>("Application", applicationSchema);
