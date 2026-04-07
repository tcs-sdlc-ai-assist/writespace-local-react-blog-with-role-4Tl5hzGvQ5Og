import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, getCurrentUser } from '../utils/auth';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getCurrentUser();
    if (session) {
      navigate('/blogs', { replace: true });
    }
  }, [navigate]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (username.trim().toLowerCase() === 'admin') {
      setError('This username is not available.');
      return;
    }

    setLoading(true);

    const session = register(displayName.trim(), username.trim(), password);

    if (!session) {
      setError('Username is already taken. Please choose a different one.');
      setLoading(false);
      return;
    }

    navigate('/blogs', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
              WriteSpace
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="mt-2 text-sm text-gray-500">
                Join WriteSpace and start sharing your stories
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}