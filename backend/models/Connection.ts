import { Schema, model, Types, Document } from "mongoose";

export interface IConnection extends Document {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
}

const connectionSchema = new Schema<IConnection>(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IConnection>("Connection", connectionSchema);
