import { Schema, model, Types, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "recruiter";
  company?: Types.ObjectId;
  connections?: Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      required: true,
      default: "candidate",
    },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("connections", {
  ref: "Connection",
  localField: "_id",
  foreignField: "requester",
});

userSchema.virtual("followers", {
  ref: "Connection",
  localField: "_id",
  foreignField: "recipient",
});

const User = model<IUser>("User", userSchema);
export default User;
