import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NotificationBell } from './NotificationBell';
import { 
  Home, 
  Info, 
  Mail, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Sun, 
  Moon, 
  Menu,
  X,
  LayoutDashboard,
  MessageSquare,
  Users,
  User
} from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary-light transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ChatterHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isAuthenticated && (
              <>
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </Link>
              </>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
                <Link 
                  to="/admin/users" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </Link>
                <Link 
                  to="/admin/system" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>System</span>
                </Link>
                <Link 
                  to="/posts" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Feed</span>
                </Link>
              </>
            )}
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Link 
                  to="/posts" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Feed</span>
                </Link>
                <Link 
                  to="/find-people" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Discover</span>
                </Link>
                <Link 
                  to="/chat" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications (only for authenticated users) */}
            {isAuthenticated && <NotificationBell />}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={`/profile/${user?._id}`}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium">{user?.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 px-4 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-2">
              {!isAuthenticated && (
                <>
                  <Link 
                    to="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Info className="w-5 h-5" />
                    <span>About</span>
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Contact</span>
                  </Link>
                </>
              )}
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/posts" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Feed</span>
                  </Link>
                  <Link 
                    to="/find-people" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Users className="w-5 h-5" />
                    <span>Discover</span>
                  </Link>
                  <Link 
                    to="/chat" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Chat</span>
                  </Link>
                  <Link 
                    to={`/profile/${user?._id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
