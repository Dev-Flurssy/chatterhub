import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get system statistics
export const getSystemStats = async (req, res) => {
  try {
    // Get database stats
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const messageCount = await Message.countDocuments();
    const conversationCount = await Conversation.countDocuments();

    // Get upload directory stats
    const uploadsPath = path.join(__dirname, '../public/uploads');
    let uploadStats = { count: 0, size: 0 };

    try {
      const files = fs.readdirSync(uploadsPath);
      uploadStats.count = files.length;
      
      files.forEach(file => {
        const filePath = path.join(uploadsPath, file);
        const stats = fs.statSync(filePath);
        uploadStats.size += stats.size;
      });
    } catch (error) {
      console.error('Error reading uploads directory:', error);
    }

    // Estimate database size (rough calculation)
    const avgUserSize = 2000; // bytes
    const avgPostSize = 5000;
    const avgMessageSize = 500;
    const avgConversationSize = 1000;

    const estimatedDbSize = 
      (userCount * avgUserSize) +
      (postCount * avgPostSize) +
      (messageCount * avgMessageSize) +
      (conversationCount * avgConversationSize);

    // Mock total and available size (you can adjust these)
    const totalSize = 10 * 1024 * 1024 * 1024; // 10GB
    const usedSize = uploadStats.size + estimatedDbSize;
    const availableSize = totalSize - usedSize;

    res.json({
      totalSize,
      usedSize,
      availableSize,
      uploads: uploadStats,
      database: {
        size: estimatedDbSize,
        collections: {
          users: userCount,
          posts: postCount,
          messages: messageCount,
          conversations: conversationCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate user (admin action)
export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'suspended';
    await user.save();

    res.json({ message: 'User deactivated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activate user (admin action)
export const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'active';
    await user.save();

    res.json({ message: 'User activated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-hashed_password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user (admin action)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user's posts
    await Post.deleteMany({ postedBy: userId });

    // Delete user's messages
    await Message.deleteMany({ sender: userId });

    // Remove user from conversations
    await Conversation.updateMany(
      { participants: userId },
      { $pull: { participants: userId } }
    );

    // Delete user
    await user.deleteOne();

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getSystemStats,
  deactivateUser,
  activateUser,
  getAllUsers,
  deleteUser,
};
