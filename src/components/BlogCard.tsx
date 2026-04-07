import { Link } from 'react-router-dom';
import { Post, Session } from '../utils/types';
import { Avatar } from './Avatar';

interface BlogCardProps {
  post: Post;
  currentUser: Session | null;
  index: number;
}

const accentColors = [
  'border-indigo-500',
  'border-violet-500',
  'border-purple-500',
  'border-fuchsia-500',
  'border-pink-500',
  'border-blue-500',
];

export function BlogCard({ post, currentUser, index }: BlogCardProps) {
  const accentColor = accentColors[index % accentColors.length];

  const canEdit =
    currentUser !== null &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  const truncatedContent =
    post.content.length > 150
      ? post.content.slice(0, 150) + '…'
      : post.content;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`rounded-2xl bg-white shadow-md border-l-4 ${accentColor} p-6 flex flex-col gap-3 transition hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar role={post.authorId === 'admin' ? 'admin' : 'user'} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {post.authorName}
            </span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>
        </div>
        {canEdit && (
          <Link
            to={`/blog/${post.id}/edit`}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
            aria-label={`Edit post "${post.title}"`}
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </Link>
        )}
      </div>

      <Link to={`/blog/${post.id}`} className="group flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {truncatedContent}
        </p>
      </Link>

      <div className="mt-auto pt-3 border-t border-gray-100">
        <Link
          to={`/blog/${post.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}