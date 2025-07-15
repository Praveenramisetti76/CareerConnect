import { Schema, model, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  website: string;
  logo?: string;
  description?: string;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
    logo: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default model<ICompany>("Company", companySchema);
