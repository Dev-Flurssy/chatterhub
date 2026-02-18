# ChatterHub - Complete Implementation Plan



### Reusable UI Components Created:
-  `Button` - Multiple variants (primary, secondary, outline, ghost, danger)
-  `Card` - With Header, Body, Footer sub-components
-  `Input` - With label, error, and icon support
-  `Modal` - Responsive modal with backdrop
- `Badge` - Status badges with variants
-  Footer - Updated with WhatsApp, Instagram, Twitter links

### Next: Custom Hooks
- [ ] `useSocket` - Socket.io connection management
- [ ] `useNotifications` - Real-time notifications
- [ ] `useChat` - Chat functionality
- [ ] `useDebounce` - Debounce input values
- [ ] `useLocalStorage` - Persistent local storage

---



### Backend Setup:
1. **Install Dependencies**
   ```bash
   cd backend
   npm install socket.io
   ```

2. **Socket Server Configuration**
   - Create `backend/socket/socketServer.js`
   - Integrate with existing server.js
   - Authentication middleware for socket connections

3. **Socket Events**
   - `connection` - User connects
   - `disconnect` - User disconnects
   - `user:online` - User comes online
   - `user:offline` - User goes offline
   - `notification:new` - New notification
   - `post:new` - New post created
   - `message:new` - New chat message
   - `message:typing` - User is typing
   - `message:read` - Message read receipt

### Frontend Setup:
1. **Install Dependencies**
   ```bash
   cd frontend-new
   npm install socket.io-client
   ```

2. **Socket Context**
   - Create `frontend-new/src/contexts/SocketContext.tsx`
   - Manage socket connection state
   - Provide socket instance to components

3. **Custom Hooks**
   - `useSocket()` - Access socket instance
   - `useOnlineStatus()` - Track user online/offline
   - `useNotifications()` - Real-time notifications

---

## 💬 Phase 3: Chat System

### Database Models:
```javascript

{
  participants: [ObjectId],
  lastMessage: {
    text: String,
    sender: ObjectId,
    timestamp: Date
  },
  unreadCount: Map<ObjectId, Number>,
  createdAt: Date,
  updatedAt: Date
}

{
  conversation: ObjectId,
  sender: ObjectId,
  text: String,
  attachments: [{
    type: String,
    url: String,
    name: String
  }],
  readBy: [ObjectId],
  createdAt: Date
}
```

### Backend API:
- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations` - Create conversation
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read
- `POST /api/messages/upload` - Upload attachment

### Frontend Components:
```
src/pages/Chat/
├── ChatPage.tsx          # Main chat layout
├── ChatList.tsx          # List of conversations
├── ChatWindow.tsx        # Active chat window
├── MessageBubble.tsx     # Individual message
├── MessageInput.tsx      # Input with emoji picker
└── ChatHeader.tsx        # Chat header with user info
```

### Features:
- ✨ Real-time messaging
- 📎 File/image attachments
- 😊 Emoji picker
- ✅ Read receipts
- 💬 Typing indicators
- 🔍 Search conversations
- 🔔 Unread message badges
- 📱 Responsive design

---

## 🎫 Phase 4: Customer Support System

### Database Models:
```javascript
// backend/models/ticket.model.js
{
  user: ObjectId,
  subject: String,
  category: String, // 'bug', 'feature', 'account', 'other'
  priority: String, // 'low', 'medium', 'high', 'urgent'
  status: String,   // 'open', 'in-progress', 'resolved', 'closed'
  messages: [{
    sender: ObjectId,
    senderType: String, // 'user' or 'admin'
    message: String,
    attachments: [String],
    timestamp: Date
  }],
  assignedTo: ObjectId, // Admin user
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date
}
```

### Backend API:
- `POST /api/support/tickets` - Create ticket
- `GET /api/support/tickets` - Get user's tickets
- `GET /api/support/tickets/:id` - Get ticket details
- `POST /api/support/tickets/:id/reply` - Reply to ticket
- `PUT /api/support/tickets/:id/status` - Update status (admin)
- `GET /api/admin/support/tickets` - Get all tickets (admin)
- `PUT /api/admin/support/tickets/:id/assign` - Assign ticket (admin)

### Frontend Pages:
```
User Side:
- /support - Support center
- /support/new - Create ticket
- /support/tickets - My tickets
- /support/tickets/:id - Ticket details

Admin Side:
- /admin/support - Support dashboard
- /admin/support/tickets - All tickets
- /admin/support/tickets/:id - Ticket management
```

### Features:
- 📝 Create support tickets
- 💬 Real-time ticket updates
- 📎 File attachments
- 🏷️ Category & priority tags
- 📊 Ticket statistics (admin)
- 🔔 Notifications for new replies
- 🔍 Search & filter tickets

---



### User Management Features:

#### 1. Warn User
```javascript
// backend/models/warning.model.js
{
  user: ObjectId,
  admin: ObjectId,
  reason: String,
  severity: String, // 'low', 'medium', 'high'
  createdAt: Date
}
```

#### 2. Suspend/Activate Account
```javascript
// Update user.model.js
{
  status: String, // 'active', 'suspended', 'banned'
  suspensionReason: String,
  suspendedAt: Date,
  suspendedBy: ObjectId,
  suspensionExpiry: Date // null for permanent
}
```

#### 3. Delete User
- Soft delete (mark as deleted)
- Hard delete (remove from database)
- Cascade delete user's posts, comments, etc.

### Backend API:
- `POST /api/admin/users/:id/warn` - Warn user
- `PUT /api/admin/users/:id/suspend` - Suspend account
- `PUT /api/admin/users/:id/activate` - Activate account
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/:id/warnings` - Get user warnings
- `GET /api/admin/users/:id/activity` - Get user activity log

### Admin Dashboard Pages:
```
/admin/users - User management
/admin/users/:id - User details
/admin/users/:id/warnings - Warning history
/admin/moderation - Moderation queue
/admin/reports - User reports
```

### Features:
- 🚨 Warning system with severity levels
- 🔒 Account suspension (temporary/permanent)
- ❌ User deletion with confirmation
- 📊 User activity logs
- 📈 Moderation statistics
- 🔍 Search & filter users
- 📧 Email notifications to users

---



### Notification Types:
1. **Social Notifications**
   - New follower
   - Post liked
   - Post commented
   - Mentioned in post/comment

2. **Chat Notifications**
   - New message
   - Message read

3. **System Notifications**
   - Account warning
   - Account suspended
   - Support ticket reply
   - New feature announcement

### Database Model:
```javascript
// backend/models/notification.model.js
{
  recipient: ObjectId,
  sender: ObjectId,
  type: String,
  title: String,
  message: String,
  link: String,
  read: Boolean,
  data: Object, // Additional data
  createdAt: Date
}
```

### Backend API:
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Frontend Components:
```
src/components/Notifications/
├── NotificationBell.tsx      # Bell icon with badge
├── NotificationDropdown.tsx  # Dropdown list
├── NotificationItem.tsx      # Individual notification
└── NotificationCenter.tsx    # Full notification page
```

### Features:
- 🔔 Real-time notification delivery
- 🔴 Unread badge count
- 🔊 Sound notifications (optional)
- 📱 Push notifications (future)
- 🗑️ Delete notifications
- ✅ Mark as read/unread
- 🔍 Filter by type

---

## 📁 Folder Structure

```
frontend-new/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Badge.tsx
│   │   ├── chat/                  # Chat components
│   │   ├── notifications/         # Notification components
│   │   ├── support/               # Support components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── SocketContext.tsx      # NEW
│   │   └── NotificationContext.tsx # NEW
│   ├── hooks/
│   │   ├── useSocket.ts           # NEW
│   │   ├── useNotifications.ts    # NEW
│   │   ├── useChat.ts             # NEW
│   │   ├── useDebounce.ts         # NEW
│   │   └── useLocalStorage.ts     # NEW
│   ├── pages/
│   │   ├── Chat/                  # NEW
│   │   ├── Support/               # NEW
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UserManagement.tsx # NEW
│   │   │   ├── SupportDashboard.tsx # NEW
│   │   │   └── Moderation.tsx     # NEW
│   │   └── ...
│   └── lib/
│       ├── socket.ts              # NEW
│       ├── chatApi.ts             # NEW
│       └── supportApi.ts          # NEW

backend/
├── models/
│   ├── conversation.model.js      # NEW
│   ├── message.model.js           # NEW
│   ├── ticket.model.js            # NEW
│   ├── notification.model.js      # NEW
│   └── warning.model.js           # NEW
├── controllers/
│   ├── chat.controller.js         # NEW
│   ├── support.controller.js      # NEW
│   └── notification.controller.js # NEW
├── routes/
│   ├── chat.route.js              # NEW
│   ├── support.route.js           # NEW
│   └── notification.route.js      # NEW
└── socket/
    ├── socketServer.js            # NEW
    ├── chatHandlers.js            # NEW
    └── notificationHandlers.js    # NEW
```

---

## 🚀 Implementation Order

### Week 1: Socket.io & Real-Time Foundation
- [ ] Set up Socket.io server
- [ ] Create SocketContext
- [ ] Implement online/offline status
- [ ] Basic real-time notifications

### Week 2: Chat System
- [ ] Database models (Conversation, Message)
- [ ] Backend API endpoints
- [ ] Chat UI components
- [ ] Real-time messaging
- [ ] File attachments

### Week 3: Customer Support
- [ ] Ticket model & API
- [ ] User support pages
- [ ] Admin support dashboard
- [ ] Real-time ticket updates

### Week 4: Admin Controls & Polish
- [ ] User management features
- [ ] Warning system
- [ ] Account suspension
- [ ] Moderation tools
- [ ] Testing & bug fixes

---

## 🎨 Design System

### Colors (Already Configured):
- Primary: `#3f4771` (Purple)
- Secondary: `#ff4081` (Pink)
- Success: Green
- Warning: Yellow
- Danger: Red

### Typography:
- Headings: Bold, gradient text
- Body: Regular weight
- Buttons: Semi-bold

### Spacing:
- Consistent padding/margin scale
- Card spacing: p-6
- Section spacing: py-16

### Animations:
- Smooth transitions (300ms)
- Hover effects (scale, shadow)
- Loading states
- Fade in/out

---
