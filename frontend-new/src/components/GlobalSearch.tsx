import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, User, FileText, Loader2 } from 'lucide-react';
import { userApi } from '@/lib/userApi';
import { postApi } from '@/lib/postApi';
import type { User as UserType, Post } from '@/types';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts'>('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 0) {
        handleSearch();
      } else {
        setUsers([]);
        setPosts([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSearch = async () => {
    if (query.trim().length === 0) return;

    setLoading(true);
    try {
      const [usersData, postsData] = await Promise.all([
        userApi.searchUsers(query),
        postApi.searchPosts(query),
      ]);
      setUsers(usersData);
      setPosts(postsData);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setUsers([]);
    setPosts([]);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    setUsers([]);
    setPosts([]);
  };

  const filteredUsers = activeTab === 'posts' ? [] : users;
  const filteredPosts = activeTab === 'users' ? [] : posts;
  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search users, posts..."
          className="w-full pl-11 pr-10 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-[500px] overflow-hidden z-50">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 p-2 space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All ({users.length + posts.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Posts ({posts.length})
            </button>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : hasResults ? (
              <div className="p-2">
                {/* Users Section */}
                {filteredUsers.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-3 py-2">
                      Users
                    </h3>
                    <div className="space-y-1">
                      {filteredUsers.map((user) => (
                        <Link
                          key={user._id}
                          to={`/profile/${user._id}`}
                          onClick={handleResultClick}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          <User className="w-4 h-4 text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts Section */}
                {filteredPosts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-3 py-2">
                      Posts
                    </h3>
                    <div className="space-y-1">
                      {filteredPosts.map((post) => (
                        <div
                          key={post._id}
                          onClick={handleResultClick}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <FileText className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {typeof post.postedBy === 'object' && post.postedBy?.profilePic ? (
                                <img
                                  src={post.postedBy.profilePic}
                                  alt={post.postedBy.name}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                                  {typeof post.postedBy === 'object' && post.postedBy?.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {typeof post.postedBy === 'object' ? post.postedBy?.name : 'Unknown'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                              {post.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No results found for "{query}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
