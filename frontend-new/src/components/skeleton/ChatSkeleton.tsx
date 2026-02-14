import { Skeleton, SkeletonAvatar } from './Skeleton.tsx';

export function ConversationSkeleton() {
  return (
    <div className="p-4 flex items-start space-x-3 border-b border-gray-100 dark:border-gray-700">
      <SkeletonAvatar />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-3 w-16 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ConversationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <ConversationSkeleton key={i} />
      ))}
    </div>
  );
}

export function MessageSkeleton({ isSent = false }: { isSent?: boolean }) {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[70%] space-y-1">
        <Skeleton 
          className={`h-16 ${isSent ? 'w-48 rounded-2xl rounded-br-none' : 'w-56 rounded-2xl rounded-bl-none'}`}
        />
        <Skeleton className={`h-3 w-20 ${isSent ? 'ml-auto' : ''}`} />
      </div>
    </div>
  );
}

export function MessageListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      {Array.from({ length: count }).map((_, i) => (
        <MessageSkeleton key={i} isSent={i % 3 === 0} />
      ))}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="grid grid-cols-12 h-full">
        {/* Conversations Sidebar */}
        <div className="col-span-12 md:col-span-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Skeleton className="h-8 w-32 mb-4 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Conversations */}
          <ConversationListSkeleton />
        </div>

        {/* Chat Area */}
        <div className="col-span-12 md:col-span-8 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center space-x-3">
              <SkeletonAvatar />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
          </div>

          {/* Messages */}
          <MessageListSkeleton />

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="flex-1 h-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
