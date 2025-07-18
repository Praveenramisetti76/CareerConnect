import mongoose from "mongoose";

const { Schema, model } = mongoose;

const jobSchema = new Schema(
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

const Job = model("Job", jobSchema);
export default Job;
