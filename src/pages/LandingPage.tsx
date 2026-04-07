import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, Session } from '../utils/types';
import { getPosts } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { BlogCard } from '../components/BlogCard';
import PublicNavbar from '../components/PublicNavbar';

const features = [
  {
    icon: '✍️',
    title: 'Easy Writing',
    description:
      'Create and publish blog posts with a clean, distraction-free editor. Focus on your words and share your stories effortlessly.',
  },
  {
    icon: '🔐',
    title: 'Role-Based Access',
    description:
      'Admins manage users and all content. Regular users create, edit, and delete their own posts with full control.',
  },
  {
    icon: '💾',
    title: 'Local Storage',
    description:
      'All your data is stored securely in your browser. No external servers, no accounts to worry about — just write and go.',
  },
];

export default function LandingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const currentSession = getCurrentUser();
    setSession(currentSession);

    const allPosts = getPosts();
    const sorted = [...allPosts]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {!session && <PublicNavbar />}

      <section className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="text-5xl">📝</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-4">
            Welcome to{' '}
            <span className="text-indigo-600">WriteSpace</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            A modern blogging platform where you can share your thoughts, stories,
            and ideas with the world. Simple, fast, and beautifully designed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <Link
                to={session.role === 'admin' ? '/admin' : '/home'}
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors"
              >
                Go to Dashboard
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors"
                >
                  Get Started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 text-base font-semibold text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why WriteSpace?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Everything you need to start blogging, right in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-md border border-gray-100 p-6 flex flex-col items-center text-center gap-4 transition hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-3xl shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Latest Posts
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              See what the community has been writing about recently.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-sm text-gray-500 max-w-md mb-6">
                Be the first to share your thoughts! Create an account and start
                writing your first blog post.
              </p>
              {!session && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Start Writing
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUser={session}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <Link
                to="/"
                className="text-xl font-bold text-indigo-600 tracking-tight"
              >
                WriteSpace
              </Link>
              <p className="text-sm text-gray-500">
                A modern blogging platform for everyone.
              </p>
            </div>

            <div className="flex items-center gap-6">
              {session ? (
                <>
                  <Link
                    to="/home"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Blogs
                  </Link>
                  <Link
                    to="/blog/new"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Write
                  </Link>
                  {session.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}