import { Schema, model, Types, Document } from "mongoose";

export interface IChat extends Document {
  participants: Types.ObjectId[];
  messages: {
    sender: Types.ObjectId;
    content: string;
    timestamp: Date;
  }[];
}

const chatSchema = new Schema<IChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default model<IChat>("Chat", chatSchema);
