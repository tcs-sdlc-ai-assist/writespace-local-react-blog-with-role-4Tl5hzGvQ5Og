import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Post, Session } from '../utils/types';
import { getPosts, savePosts } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { Avatar } from '../components/Avatar';

export default function ReadBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [currentUser, setCurrentUser] = useState<Session | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const session = getCurrentUser();
    setCurrentUser(session);

    const posts = getPosts();
    const found = posts.find((p) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const canEdit =
    currentUser !== null &&
    post !== null &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  function handleDelete() {
    if (!post) return;
    const posts = getPosts();
    const updated = posts.filter((p) => p.id !== post.id);
    savePosts(updated);
    navigate('/blogs');
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
          >
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Back to Posts
          </Link>
        </div>

        <article className="rounded-2xl bg-white shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar role={post.authorId === 'admin-001' ? 'admin' : 'user'} size="lg" />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-900">
                {post.authorName}
              </span>
              <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {canEdit && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
              <Link
                to={`/blog/${post.id}/edit`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
              >
                Edit Post
              </Link>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors"
              >
                Delete Post
              </button>
            </div>
          )}
        </article>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Post</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete "{post.title}"? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}