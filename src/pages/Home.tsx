import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, Session } from '../utils/types';
import { getPosts } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { BlogCard } from '../components/BlogCard';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<Session | null>(null);

  useEffect(() => {
    const session = getCurrentUser();
    setCurrentUser(session);

    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse the latest posts from the community
            </p>
          </div>
          <Link
            to="/write"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Write Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No posts yet
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Be the first to share your thoughts with the community. Start writing your first blog post now!
            </p>
            <Link
              to="/write"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}