import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", // Refers to both Student and Alumni in the User model
      required: true,
    }
  ],
  lastMessage: {
    type: String,
    required: false,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Conversation", conversationSchema);
