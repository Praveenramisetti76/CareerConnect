import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const chatSchema = new Schema(
  {
    participants: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        sender: {
          type: Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);
export default Chat;
