import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectionSchema = new Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    actionUser: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

connectionSchema.index(
  { requester: 1, recipient: 1 },
  { unique: true }
);

const Connection = model("Connection", connectionSchema);
export default Connection;
