import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { useUserSearch } from '@/hooks/useUserSearch';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { UserSearch } from '@/components/chat/UserSearch';
import { ArrowLeft, MoreVertical, Send } from 'lucide-react';

export function Chat() {
  const { user } = useAuth();
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    selectConversation,
    sendMessage,
    handleTyping,
    startChat,
    getOtherUser,
    isTyping,
    setSelectedConversation,
  } = useChat();

  const {
    searchQuery,
    searchResults,
    searchUsers,
    clearSearch,
  } = useUserSearch();

  const handleStartChat = async (otherUser: any) => {
    await startChat(otherUser);
    clearSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="grid grid-cols-12 h-full">
            {/* Conversations Sidebar */}
            <div className={`col-span-12 md:col-span-4 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                  Messages
                </h2>
                
                <UserSearch
                  searchQuery={searchQuery}
                  searchResults={searchResults}
                  onSearch={searchUsers}
                  onSelectUser={handleStartChat}
                />
              </div>

              {/* Conversations List */}
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                currentUserId={user?._id}
                onSelectConversation={selectConversation}
                getOtherUser={getOtherUser}
                isTyping={isTyping}
              />
            </div>

            {/* Chat Area */}
            <div className={`col-span-12 md:col-span-8 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <img
                        src={getOtherUser(selectedConversation).profilePic || '/uploads/defaultphoto.png'}
                        alt={getOtherUser(selectedConversation).name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {getOtherUser(selectedConversation).name}
                        </p>
                        {isTyping(selectedConversation) && (
                          <p className="text-sm text-primary">typing...</p>
                        )}
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Messages */}
                  <MessageList
                    messages={messages}
                    currentUserId={user?._id}
                    loading={loading}
                  />

                  {/* Message Input */}
                  <MessageInput
                    onSendMessage={sendMessage}
                    onTyping={handleTyping}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-xl font-semibold mb-2">Welcome to ChatterHub Chat</p>
                  <p className="text-center">Select a conversation or search for users to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
