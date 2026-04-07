import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getCurrentUser } from '../utils/auth';
import PublicNavbar from '../components/PublicNavbar';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getCurrentUser();
    if (session) {
      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    try {
      const session = login(username.trim(), password);

      if (!session) {
        setError('Invalid username or password.');
        setLoading(false);
        return;
      }

      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <PublicNavbar />

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your WriteSpace account
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors sm:text-sm"
                  placeholder="Enter your username"
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
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}