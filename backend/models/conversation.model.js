import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Method to get conversation between two users
conversationSchema.statics.findOrCreate = async function (userId1, userId2) {
  let conversation = await this.findOne({
    participants: { $all: [userId1, userId2], $size: 2 },
  }).populate("participants", "name username email profilePic");

  if (!conversation) {
    conversation = await this.create({
      participants: [userId1, userId2],
      unreadCount: {
        [userId1]: 0,
        [userId2]: 0,
      },
    });
    conversation = await conversation.populate(
      "participants",
      "name username email profilePic"
    );
  }

  return conversation;
};

export default mongoose.model("Conversation", conversationSchema);
