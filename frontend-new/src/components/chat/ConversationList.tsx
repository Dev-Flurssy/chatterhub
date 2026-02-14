import { formatDistanceToNow } from 'date-fns';
import type { Conversation, User } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  currentUserId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  getOtherUser: (conversation: Conversation) => User;
  isTyping: (conversation: Conversation) => boolean;
}

export function ConversationList({
  conversations,
  selectedConversation,
  currentUserId,
  onSelectConversation,
  getOtherUser,
  isTyping,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8 text-center">
        <p className="mb-2">No conversations yet</p>
        <p className="text-sm">Search for users to start chatting!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const otherUser = getOtherUser(conversation);
        const unreadCount = conversation.unreadCount?.get?.(currentUserId || '') || 0;
        
        return (
          <button
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
              selectedConversation?._id === conversation._id ? 'bg-primary/5 dark:bg-primary/10' : ''
            }`}
          >
            <div className="relative">
              <img
                src={otherUser.profilePic || '/uploads/defaultphoto.png'}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {otherUser.name}
                </p>
                {conversation.lastMessageAt && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              {isTyping(conversation) ? (
                <p className="text-sm text-primary italic">typing...</p>
              ) : conversation.lastMessage ? (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {typeof conversation.lastMessage === 'object' && conversation.lastMessage.content}
                </p>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No messages yet</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
