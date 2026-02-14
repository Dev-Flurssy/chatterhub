import { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<boolean | void>;
  onTyping: () => void;
}

export function MessageInput({ onSendMessage, onTyping }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const success = await onSendMessage(newMessage);
    if (success !== false) {
      setNewMessage('');
    }
    setSending(false);
  };

  const handleChange = (value: string) => {
    setNewMessage(value);
    onTyping();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
