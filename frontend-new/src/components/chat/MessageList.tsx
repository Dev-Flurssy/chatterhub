import { useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { MessageListSkeleton } from '@/components/skeleton';
import type { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  loading: boolean;
}

export function MessageList({ messages, currentUserId, loading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <MessageListSkeleton count={8} />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      {messages.map((message) => {
        const isSent = typeof message.sender === 'object' 
          ? message.sender._id === currentUserId 
          : message.sender === currentUserId;
        const isRead = message.readBy.length > 1;

        return (
          <div
            key={message._id}
            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${isSent ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-2 rounded-2xl ${
                  isSent
                    ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-md'
                }`}
              >
                <p className="break-words">{message.content}</p>
              </div>
              <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400 ${isSent ? 'justify-end' : 'justify-start'}`}>
                <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
                {isSent && (
                  isRead ? (
                    <CheckCheck className="w-4 h-4 text-primary" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
