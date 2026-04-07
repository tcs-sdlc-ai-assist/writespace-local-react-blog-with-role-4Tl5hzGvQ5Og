import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
              WriteSpace
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
            >
              Get Started
            </Link>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md text-center transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}