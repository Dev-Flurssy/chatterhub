// User types
export interface User {
  _id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  about?: string;
  profilePic?: string;
  following: string[];
  followers: string[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthData {
  token: string;
  user: User;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

// Post types
export interface Comment {
  _id: string;
  text: string;
  postedBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  text: string;
  photo?: string; // URL to photo
  video?: string; // URL to video
  mediaType?: 'photo' | 'video' | 'none';
  postedBy: User | string;
  comments: Comment[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  commentCount?: number;
}

// API Response types
export interface ApiError {
  error: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// Chat types
export interface Message {
  _id: string;
  conversation: string;
  sender: User | string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
  deleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt: string;
  unreadCount: Map<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface TypingUser {
  userId: string;
  conversationId: string;
}
