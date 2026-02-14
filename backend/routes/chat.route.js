import express from "express";
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  searchUsers,
} from "../controllers/chat.controller.js";
import { requireAuth } from "../controllers/auth.controller.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all conversations
router.get("/conversations", getConversations);

// Search users to chat with
router.get("/users/search", searchUsers);

// Get or create conversation with a user
router.get("/conversations/user/:otherUserId", getOrCreateConversation);

// Get messages in a conversation
router.get("/conversations/:conversationId/messages", getMessages);

// Send a message
router.post("/conversations/:conversationId/messages", sendMessage);

// Mark messages as read
router.put("/conversations/:conversationId/read", markAsRead);

// Delete a message
router.delete("/messages/:messageId", deleteMessage);

export default router;
