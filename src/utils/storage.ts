import { Post, User, Session } from './types';

const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';
const SESSION_KEY = 'writespace_session';

export function getPosts(): Post[] {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (!data) return [];
    const parsed: Post[] = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    console.error('Failed to save posts to localStorage');
  }
}

export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];
    const parsed: User[] = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    console.error('Failed to save users to localStorage');
  }
}

export function getSession(): Session | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    const parsed: Session = JSON.parse(data);
    if (parsed && typeof parsed.userId === 'string' && typeof parsed.username === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    console.error('Failed to save session to localStorage');
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    console.error('Failed to clear session from localStorage');
  }
}