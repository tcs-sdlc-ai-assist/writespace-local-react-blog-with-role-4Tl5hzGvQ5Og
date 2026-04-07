import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Session } from '../utils/types';
import { logout } from '../utils/auth';
import { Avatar } from './Avatar';

interface NavbarProps {
  session: Session;
  onLogout: () => void;
}

export default function Navbar({ session, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = session.role === 'admin';

  function handleLogout() {
    logout();
    onLogout();
    navigate('/login');
  }

  function isActive(path: string): boolean {
    return location.pathname === path;
  }

  const linkBase =
    'px-3 py-2 text-sm font-medium rounded-md transition-colors';
  const linkActive = 'text-indigo-600 bg-indigo-50';
  const linkInactive = 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50';

  const mobileLinkBase =
    'block px-3 py-2 text-base font-medium rounded-md transition-colors';
  const mobileLinkActive = 'text-indigo-600 bg-indigo-50';
  const mobileLinkInactive =
    'text-gray-700 hover:text-indigo-600 hover:bg-gray-50';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <Link
                to="/home"
                className="text-2xl font-bold text-indigo-600 tracking-tight"
              >
                WriteSpace
              </Link>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-1">
              <Link
                to="/home"
                className={`${linkBase} ${isActive('/home') ? linkActive : linkInactive}`}
              >
                Blogs
              </Link>
              <Link
                to="/blog/new"
                className={`${linkBase} ${isActive('/blog/new') ? linkActive : linkInactive}`}
              >
                Write
              </Link>
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className={`${linkBase} ${isActive('/admin') ? linkActive : linkInactive}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`${linkBase} ${isActive('/admin/users') ? linkActive : linkInactive}`}
                  >
                    Users
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <Avatar role={session.role} size="sm" />
              <span className="text-sm font-medium text-gray-700">
                {session.displayName}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-gray-100">
              <Avatar role={session.role} size="sm" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {session.displayName}
                </span>
                <span className="text-xs text-gray-500">@{session.username}</span>
              </div>
            </div>

            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className={`${mobileLinkBase} ${isActive('/home') ? mobileLinkActive : mobileLinkInactive}`}
            >
              Blogs
            </Link>
            <Link
              to="/blog/new"
              onClick={() => setMobileMenuOpen(false)}
              className={`${mobileLinkBase} ${isActive('/blog/new') ? mobileLinkActive : mobileLinkInactive}`}
            >
              Write
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${mobileLinkBase} ${isActive('/admin') ? mobileLinkActive : mobileLinkInactive}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${mobileLinkBase} ${isActive('/admin/users') ? mobileLinkActive : mobileLinkInactive}`}
                >
                  Users
                </Link>
              </>
            )}

            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}