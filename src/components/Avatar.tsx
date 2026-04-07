import { UserRole } from '../utils/types';

interface AvatarProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ role, size = 'md' }: AvatarProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
  };

  const bgClass = role === 'admin' ? 'bg-violet-200' : 'bg-indigo-200';
  const emoji = role === 'admin' ? '👑' : '📖';

  return (
    <div
      className={`${sizeClasses[size]} ${bgClass} rounded-full flex items-center justify-center select-none shrink-0`}
      aria-label={role === 'admin' ? 'Admin avatar' : 'User avatar'}
    >
      <span>{emoji}</span>
    </div>
  );
}