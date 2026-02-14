import jwt from 'jsonwebtoken';

/**
 * Socket.io Server Setup
 * Handles real-time communication for chat, notifications, and live updates
 */

// Store online users: Map<userId, socketId>
const onlineUsers = new Map();

// Store user sockets: Map<socketId, userId>
const userSockets = new Map();

/**
 * Initialize Socket.io server
 * @param {Server} io - Socket.io server instance
 */
export const initializeSocket = (io) => {
  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded._id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      console.error('[Socket] Authentication error:', error.message);
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`[Socket] User connected: ${userId} (${socket.id})`);

    // Store user connection
    onlineUsers.set(userId, socket.id);
    userSockets.set(socket.id, userId);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Notify others that user is online
    socket.broadcast.emit('user:online', { userId });

    // Send online users list to the connected user
    const onlineUsersList = Array.from(onlineUsers.keys());
    socket.emit('users:online', { users: onlineUsersList });

    // Handle user going online explicitly
    socket.on('user:online', () => {
      onlineUsers.set(userId, socket.id);
      socket.broadcast.emit('user:online', { userId });
    });

    // Handle typing indicator
    socket.on('typing:start', ({ recipientId }) => {
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing:start', { userId });
      }
    });

    socket.on('typing:stop', ({ recipientId }) => {
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing:stop', { userId });
      }
    });

    // Handle new message
    socket.on('message:send', (data) => {
      const { recipientId, message } = data;
      const recipientSocketId = onlineUsers.get(recipientId);
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('message:new', {
          senderId: userId,
          message,
          timestamp: new Date()
        });
      }
    });

    // Handle message read
    socket.on('message:read', (data) => {
      const { senderId, messageId } = data;
      const senderSocketId = onlineUsers.get(senderId);
      
      if (senderSocketId) {
        io.to(senderSocketId).emit('message:read', {
          messageId,
          readBy: userId,
          timestamp: new Date()
        });
      }
    });

    // Handle new notification
    socket.on('notification:send', (data) => {
      const { recipientId, notification } = data;
      io.to(`user:${recipientId}`).emit('notification:new', notification);
    });

    // Handle new post
    socket.on('post:new', (data) => {
      // Broadcast to all followers
      socket.broadcast.emit('post:new', {
        postId: data.postId,
        authorId: userId,
        timestamp: new Date()
      });
    });

    // Handle post like
    socket.on('post:like', (data) => {
      const { postAuthorId, postId } = data;
      io.to(`user:${postAuthorId}`).emit('post:liked', {
        postId,
        likedBy: userId,
        timestamp: new Date()
      });
    });

    // Handle post comment
    socket.on('post:comment', (data) => {
      const { postAuthorId, postId, comment } = data;
      io.to(`user:${postAuthorId}`).emit('post:commented', {
        postId,
        commentedBy: userId,
        comment,
        timestamp: new Date()
      });
    });

    // Handle follow
    socket.on('user:follow', (data) => {
      const { followedUserId } = data;
      io.to(`user:${followedUserId}`).emit('user:followed', {
        followerId: userId,
        timestamp: new Date()
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${userId} (${socket.id})`);
      
      // Remove from online users
      onlineUsers.delete(userId);
      userSockets.delete(socket.id);

      // Notify others that user is offline
      socket.broadcast.emit('user:offline', { userId });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`[Socket] Error for user ${userId}:`, error);
    });
  });

  console.log('[Socket] Socket.io server initialized');
};

/**
 * Get online users
 * @returns {Array} Array of online user IDs
 */
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

/**
 * Check if user is online
 * @param {string} userId - User ID
 * @returns {boolean}
 */
export const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};

/**
 * Send notification to specific user
 * @param {Server} io - Socket.io server instance
 * @param {string} userId - User ID
 * @param {Object} notification - Notification data
 */
export const sendNotificationToUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
};

/**
 * Broadcast to all users
 * @param {Server} io - Socket.io server instance
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
export const broadcastToAll = (io, event, data) => {
  io.emit(event, data);
};

export default {
  initializeSocket,
  getOnlineUsers,
  isUserOnline,
  sendNotificationToUser,
  broadcastToAll
};
