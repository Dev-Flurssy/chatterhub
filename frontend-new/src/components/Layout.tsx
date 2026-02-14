import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const hideLayout = ['/signin', '/signup', '/forgot-password'];
  const isHidden = hideLayout.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {!isHidden && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHidden && <Footer />}
    </div>
  );
}
