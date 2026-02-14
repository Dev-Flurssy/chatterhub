import { Search } from 'lucide-react';
import type { User } from '@/types';

interface UserSearchProps {
  searchQuery: string;
  searchResults: User[];
  onSearch: (query: string) => void;
  onSelectUser: (user: User) => void;
}

export function UserSearch({ searchQuery, searchResults, onSearch, onSelectUser }: UserSearchProps) {
  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
        />
      </div>

      {searchResults.length > 0 && (
        <div className="mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <button
              key={user._id}
              onClick={() => onSelectUser(user)}
              className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <img
                src={user.profilePic || '/uploads/defaultphoto.png'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username || user.email}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
