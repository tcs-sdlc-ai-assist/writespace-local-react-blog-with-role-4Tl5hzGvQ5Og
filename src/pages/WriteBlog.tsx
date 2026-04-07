import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Post } from '../utils/types';
import { getPosts, savePosts } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';

export default function WriteBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const session = getCurrentUser();

  const TITLE_MIN = 3;
  const TITLE_MAX = 150;
  const CONTENT_MIN = 10;
  const CONTENT_MAX = 10000;

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode && id) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setError('Post not found.');
        setLoading(false);
        return;
      }

      const canEdit =
        session.role === 'admin' || session.userId === post.authorId;

      if (!canEdit) {
        setError('You do not have permission to edit this post.');
        setLoading(false);
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    }

    setLoading(false);
  }, [id, isEditMode, navigate, session]);

  function generateId(): string {
    return (
      crypto.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    );
  }

  function validate(): string | null {
    if (!title.trim()) {
      return 'Title is required.';
    }
    if (title.trim().length < TITLE_MIN) {
      return `Title must be at least ${TITLE_MIN} characters.`;
    }
    if (title.trim().length > TITLE_MAX) {
      return `Title must be no more than ${TITLE_MAX} characters.`;
    }
    if (!content.trim()) {
      return 'Content is required.';
    }
    if (content.trim().length < CONTENT_MIN) {
      return `Content must be at least ${CONTENT_MIN} characters.`;
    }
    if (content.trim().length > CONTENT_MAX) {
      return `Content must be no more than ${CONTENT_MAX} characters.`;
    }
    return null;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const posts = getPosts();

    if (isEditMode && id) {
      const postIndex = posts.findIndex((p) => p.id === id);
      if (postIndex === -1) {
        setError('Post not found.');
        return;
      }

      const existingPost = posts[postIndex];
      const canEdit =
        session.role === 'admin' || session.userId === existingPost.authorId;

      if (!canEdit) {
        setError('You do not have permission to edit this post.');
        return;
      }

      const updatedPost: Post = {
        ...existingPost,
        title: title.trim(),
        content: content.trim(),
      };

      const updatedPosts = [...posts];
      updatedPosts[postIndex] = updatedPost;
      savePosts(updatedPosts);
      navigate(`/blog/${id}`);
    } else {
      const newPost: Post = {
        id: generateId(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        authorId: session.userId,
        authorName: session.displayName,
      };

      savePosts([newPost, ...posts]);
      navigate(`/blog/${newPost.id}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading…</p>
      </div>
    );
  }

  if (error && isEditMode && (error === 'Post not found.' || error === 'You do not have permission to edit this post.')) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="rounded-2xl bg-white shadow-md p-8 max-w-md w-full text-center">
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <Link
            to="/blogs"
            className="inline-block px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
          >
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Back to Posts
          </Link>
        </div>

        <div className="rounded-2xl bg-white shadow-md p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </h1>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                maxLength={TITLE_MAX}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">
                  {TITLE_MIN}–{TITLE_MAX} characters
                </span>
                <span
                  className={`text-xs ${
                    title.trim().length > TITLE_MAX
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                >
                  {title.trim().length}/{TITLE_MAX}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="content"
                className="text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here…"
                rows={12}
                maxLength={CONTENT_MAX}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
              />
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">
                  {CONTENT_MIN}–{CONTENT_MAX} characters
                </span>
                <span
                  className={`text-xs ${
                    content.trim().length > CONTENT_MAX
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                >
                  {content.trim().length}/{CONTENT_MAX}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
              >
                {isEditMode ? 'Update Post' : 'Publish Post'}
              </button>
              <Link
                to="/blogs"
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}