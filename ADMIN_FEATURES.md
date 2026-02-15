# Admin Features Documentation

## Overview
ChatterHub now has a comprehensive admin dashboard with user management, analytics, and system monitoring capabilities.

## Admin Account
- **Creation**: Run `node createAdmin.js` in the backend directory
- **Credentials**: Set in your `.env` file (keep secure and never commit to version control)

## Admin Features

### 1. Admin Dashboard (Analytics)
**Route**: `/admin/dashboard`

Features:
- User growth analytics with interactive charts
- Post activity tracking
- Engagement metrics (likes, comments, shares)
- Real-time statistics
- PDF and CSV export functionality
- Date range filtering

### 2. User Management
**Route**: `/admin/users`

Features:
- View all users with detailed information
- Search users by name, email, or username
- Filter by role (user/admin) and status (active/suspended)
- User statistics dashboard
- Deactivate user accounts
- Permanently delete users and their data
- View user verification status (email/phone)
- Export user list to PDF

API Endpoints:
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:userId/deactivate` - Deactivate user
- `POST /api/admin/users/:userId/activate` - Activate user
- `DELETE /api/admin/users/:userId` - Delete user permanently

### 3. System Monitor
**Route**: `/admin/system`

Features:
- Storage usage monitoring
- Database size tracking
- Collection statistics (users, posts, messages, conversations)
- Upload directory monitoring
- Real-time system metrics
- Visual progress bars for storage usage

API Endpoints:
- `GET /api/admin/system/stats` - Get system statistics

## Admin Navigation
Admin users see a different navbar:
- Analytics (Dashboard)
- Users (User Management)
- System (System Monitor)
- Feed (Regular user feed)

Regular navigation items (Home, About, Contact) are hidden for all authenticated users.

## Security
- All admin routes require authentication (`requireAuth` middleware)
- All admin routes require admin role (`isAdmin` middleware)
- Admin role is checked on both frontend and backend
- JWT tokens include role information

## PDF Export
Admin can export:
- Analytics data (dashboard)
- User lists (user management)

PDF exports include:
- ChatterHub branding
- Timestamp
- Formatted tables
- Professional styling

## User Deletion
When an admin deletes a user:
1. All user's posts are deleted
2. All user's messages are deleted
3. User is removed from all conversations
4. User account is permanently deleted

## Notes
- Admin routes are registered at `/api/admin/*`
- Analytics routes are at `/api/admin/analytics/*`
- All admin operations are logged
- Deactivated users can be reactivated
- Deleted users cannot be recovered
