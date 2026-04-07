import { User } from '../utils/types';
import { Avatar } from './Avatar';

interface UserRowProps {
  user: User;
  onDelete: (userId: string) => void;
  currentUserId: string;
  isHardCodedAdmin: boolean;
}

export function UserRow({ user, onDelete, currentUserId, isHardCodedAdmin }: UserRowProps) {
  const isSelf = user.id === currentUserId;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  let tooltipText = '';
  if (isHardCodedAdmin) {
    tooltipText = 'The default admin account cannot be deleted';
  } else if (isSelf) {
    tooltipText = 'You cannot delete your own account';
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100 transition hover:shadow-md">
      <div className="flex items-center gap-4 min-w-0">
        <Avatar role={user.role} size="md" />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {user.displayName}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'admin'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {user.role}
            </span>
          </div>
          <span className="text-sm text-gray-500 truncate">@{user.username}</span>
          <span className="text-xs text-gray-400 mt-0.5">Joined {formattedDate}</span>
        </div>
      </div>

      <div className="shrink-0 relative group">
        <button
          type="button"
          onClick={() => onDelete(user.id)}
          disabled={deleteDisabled}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            deleteDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
          }`}
          aria-label={`Delete user ${user.displayName}`}
        >
          Delete
        </button>
        {deleteDisabled && tooltipText && (
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
            <div className="bg-gray-800 text-white text-xs rounded-md px-3 py-1.5 whitespace-nowrap shadow-lg">
              {tooltipText}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}