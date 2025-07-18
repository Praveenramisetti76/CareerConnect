import mongoose from "mongoose";

const { Schema, model } = mongoose;

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
    logo: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);
export default Company;
