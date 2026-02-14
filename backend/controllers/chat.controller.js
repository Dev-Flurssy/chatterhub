import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.auth._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name username email profilePic")
      .populate({
        path: "lastMessage",
        select: "content sender createdAt messageType",
      })
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get or create conversation with a user
export const getOrCreateConversation = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { otherUserId } = req.params;

    if (userId === otherUserId) {
      return res.status(400).json({ error: "Cannot chat with yourself" });
    }

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const conversation = await Conversation.findOrCreate(userId, otherUserId);

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if user is participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const messages = await Message.find({
      conversation: conversationId,
      deleted: false,
    })
      .populate("sender", "name username profilePic")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      conversation: conversationId,
      deleted: false,
    });

    res.json({
      messages: messages.reverse(),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { conversationId } = req.params;
    const { content, messageType = "text" } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if user is participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      content: content.trim(),
      messageType,
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();

    // Increment unread count for other participants
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== userId.toString()) {
        const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name username profilePic"
    );

    // Emit socket event to other participants
    if (req.app.get('io')) {
      const io = req.app.get('io');
      conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== userId.toString()) {
          io.to(`user:${participantId}`).emit('message:new', {
            senderId: userId,
            senderName: populatedMessage.sender.name,
            message: content.trim(),
            conversationId,
            timestamp: new Date()
          });
        }
      });
    }

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if user is participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Mark all unread messages as read
    const messages = await Message.find({
      conversation: conversationId,
      sender: { $ne: userId },
      "readBy.user": { $ne: userId },
    });

    await Promise.all(messages.map((msg) => msg.markAsRead(userId)));

    // Reset unread count
    conversation.unreadCount.set(userId.toString(), 0);
    await conversation.save();

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only sender can delete
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    message.deleted = true;
    message.deletedAt = new Date();
    message.content = "This message was deleted";
    await message.save();

    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search users to chat with
export const searchUsers = async (req, res) => {
  try {
    const userId = req.auth._id;
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: "Search query too short" });
    }

    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("name username email profilePic")
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
