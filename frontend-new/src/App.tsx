import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Policies/Privacy';
import { TermsOfService } from './pages/Policies/TermsOfService';
import { CommunityGuidelines } from './pages/Policies/CommunityGuidelines';
import { HelpCenter } from './pages/Policies/HelpCenter';
import { Signin } from './pages/Auth/Signin';
import { Signup } from './pages/Auth/Signup';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { ResetPassword } from './pages/Auth/ResetPassword';
import { Posts } from './pages/Posts/Posts';
import { Profile } from './pages/Profile/Profile';
import { EditProfile } from './pages/Profile/EditProfile';
import { FindPeople } from './pages/Profile/FindPeople';
import { AccountSettings } from './pages/Profile/AccountSettings';
import { Chat } from './pages/Chat/Chat';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { UserManagement } from './pages/Admin/UserManagement';
import { SystemMonitor } from './pages/Admin/SystemMonitor';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              {/* Public routes with layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth pages (no layout) */}
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Privacy Policy with layout */}
              <Route element={<Layout />}>
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/community-guidelines" element={<CommunityGuidelines />} />
                <Route path="/help" element={<HelpCenter />} />
              </Route>

              {/* Protected user routes with layout */}
              <Route element={<Layout />}>
                <Route
                  path="/posts"
                  element={
                    <ProtectedRoute role="user">
                      <Posts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute role="user">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute role="user">
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/find-people"
                  element={
                    <ProtectedRoute role="user">
                      <FindPeople />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account-settings"
                  element={
                    <ProtectedRoute role="user">
                      <AccountSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute role="user">
                      <Chat />
                    </ProtectedRoute>
                  }
                />

                {/* Protected admin routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute role="admin">
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/system"
                  element={
                    <ProtectedRoute role="admin">
                      <SystemMonitor />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
