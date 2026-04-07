import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post, User, Session } from '../utils/types';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { StatCard } from '../components/StatCard';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<Session | null>(null);

  useEffect(() => {
    const session = getCurrentUser();
    if (!session || session.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }
    setCurrentUser(session);
    setPosts(getPosts());
    setUsers(getUsers());
  }, [navigate]);

  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;
  const totalUsers = users.length + 1;
  const totalPosts = posts.length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  function handleDeletePost(postId: string) {
    const updated = posts.filter((p) => p.id !== postId);
    savePosts(updated);
    setPosts(updated);
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {currentUser.displayName}. Here's an overview of your platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Posts" value={totalPosts} icon="📝" />
          <StatCard title="Total Users" value={totalUsers} icon="👥" />
          <StatCard title="Admins" value={adminCount} icon="👑" />
          <StatCard title="Users" value={userCount} icon="📖" />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Write Post
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg shadow-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h2>
          {recentPosts.length === 0 ? (
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentPosts.map((post) => {
                const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={post.id}
                    className="rounded-xl bg-white shadow-sm border border-gray-100 p-5 flex items-center justify-between gap-4 transition hover:shadow-md"
                  >
                    <div className="flex flex-col min-w-0">
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors truncate"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{post.authorName}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-400">{formattedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/blog/${post.id}/edit`}
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        aria-label={`Edit post "${post.title}"`}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        aria-label={`Delete post "${post.title}"`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}