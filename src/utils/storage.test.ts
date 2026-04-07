import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage';
import { Post, User, Session } from './types';

const mockPost: Post = {
  id: '1',
  title: 'Test Post',
  content: 'Test content',
  createdAt: '2024-01-15T00:00:00.000Z',
  authorId: 'user-1',
  authorName: 'Test User',
};

const mockUser: User = {
  id: 'user-1',
  displayName: 'Test User',
  username: 'testuser',
  password: 'password123',
  role: 'user',
  createdAt: '2024-01-15T00:00:00.000Z',
};

const mockSession: Session = {
  userId: 'user-1',
  username: 'testuser',
  displayName: 'Test User',
  role: 'user',
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getPosts', () => {
  it('returns an empty array when no posts exist in localStorage', () => {
    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('returns stored posts from localStorage', () => {
    localStorage.setItem('writespace_posts', JSON.stringify([mockPost]));
    const posts = getPosts();
    expect(posts).toEqual([mockPost]);
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Test Post');
  });

  it('returns an empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('writespace_posts', 'not valid json');
    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('returns an empty array when localStorage contains a non-array value', () => {
    localStorage.setItem('writespace_posts', JSON.stringify({ not: 'an array' }));
    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('returns an empty array when localStorage contains null', () => {
    localStorage.setItem('writespace_posts', JSON.stringify(null));
    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('returns multiple posts correctly', () => {
    const secondPost: Post = {
      id: '2',
      title: 'Second Post',
      content: 'More content',
      createdAt: '2024-01-16T00:00:00.000Z',
      authorId: 'user-2',
      authorName: 'Another User',
    };
    localStorage.setItem('writespace_posts', JSON.stringify([mockPost, secondPost]));
    const posts = getPosts();
    expect(posts).toHaveLength(2);
    expect(posts[1].id).toBe('2');
  });
});

describe('savePosts', () => {
  it('saves posts to localStorage', () => {
    savePosts([mockPost]);
    const stored = localStorage.getItem('writespace_posts');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual([mockPost]);
  });

  it('saves an empty array to localStorage', () => {
    savePosts([]);
    const stored = localStorage.getItem('writespace_posts');
    expect(stored).toBe('[]');
  });

  it('overwrites existing posts in localStorage', () => {
    savePosts([mockPost]);
    const updatedPost: Post = { ...mockPost, title: 'Updated Title' };
    savePosts([updatedPost]);
    const posts = getPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Updated Title');
  });

  it('handles localStorage setItem failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    savePosts([mockPost]);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to save posts to localStorage');
  });
});

describe('getUsers', () => {
  it('returns an empty array when no users exist in localStorage', () => {
    const users = getUsers();
    expect(users).toEqual([]);
  });

  it('returns stored users from localStorage', () => {
    localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
    const users = getUsers();
    expect(users).toEqual([mockUser]);
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('testuser');
  });

  it('returns an empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('writespace_users', '{broken');
    const users = getUsers();
    expect(users).toEqual([]);
  });

  it('returns an empty array when localStorage contains a non-array value', () => {
    localStorage.setItem('writespace_users', JSON.stringify('a string'));
    const users = getUsers();
    expect(users).toEqual([]);
  });
});

describe('saveUsers', () => {
  it('saves users to localStorage', () => {
    saveUsers([mockUser]);
    const stored = localStorage.getItem('writespace_users');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual([mockUser]);
  });

  it('saves an empty array to localStorage', () => {
    saveUsers([]);
    const stored = localStorage.getItem('writespace_users');
    expect(stored).toBe('[]');
  });

  it('handles localStorage setItem failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    saveUsers([mockUser]);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to save users to localStorage');
  });
});

describe('getSession', () => {
  it('returns null when no session exists in localStorage', () => {
    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns the stored session from localStorage', () => {
    localStorage.setItem('writespace_session', JSON.stringify(mockSession));
    const session = getSession();
    expect(session).toEqual(mockSession);
    expect(session!.userId).toBe('user-1');
    expect(session!.role).toBe('user');
  });

  it('returns null when localStorage contains invalid JSON', () => {
    localStorage.setItem('writespace_session', 'not json');
    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns null when session is missing required fields', () => {
    localStorage.setItem('writespace_session', JSON.stringify({ displayName: 'Test' }));
    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns null when userId is not a string', () => {
    localStorage.setItem(
      'writespace_session',
      JSON.stringify({ userId: 123, username: 'test', displayName: 'Test', role: 'user' })
    );
    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns null when username is not a string', () => {
    localStorage.setItem(
      'writespace_session',
      JSON.stringify({ userId: 'user-1', username: null, displayName: 'Test', role: 'user' })
    );
    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns null when session value is null', () => {
    localStorage.setItem('writespace_session', JSON.stringify(null));
    const session = getSession();
    expect(session).toBeNull();
  });

  it('returns a valid admin session', () => {
    const adminSession: Session = {
      userId: 'admin-1',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };
    localStorage.setItem('writespace_session', JSON.stringify(adminSession));
    const session = getSession();
    expect(session).toEqual(adminSession);
    expect(session!.role).toBe('admin');
  });
});

describe('saveSession', () => {
  it('saves a session to localStorage', () => {
    saveSession(mockSession);
    const stored = localStorage.getItem('writespace_session');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual(mockSession);
  });

  it('overwrites an existing session', () => {
    saveSession(mockSession);
    const newSession: Session = {
      userId: 'user-2',
      username: 'anotheruser',
      displayName: 'Another User',
      role: 'admin',
    };
    saveSession(newSession);
    const session = getSession();
    expect(session).toEqual(newSession);
  });

  it('handles localStorage setItem failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    saveSession(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to save session to localStorage');
  });
});

describe('clearSession', () => {
  it('removes the session from localStorage', () => {
    saveSession(mockSession);
    expect(getSession()).not.toBeNull();
    clearSession();
    expect(getSession()).toBeNull();
    expect(localStorage.getItem('writespace_session')).toBeNull();
  });

  it('does not throw when no session exists', () => {
    expect(() => clearSession()).not.toThrow();
  });

  it('handles localStorage removeItem failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Storage error');
    });
    clearSession();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to clear session from localStorage');
  });

  it('does not affect posts or users when clearing session', () => {
    savePosts([mockPost]);
    saveUsers([mockUser]);
    saveSession(mockSession);
    clearSession();
    expect(getPosts()).toEqual([mockPost]);
    expect(getUsers()).toEqual([mockUser]);
    expect(getSession()).toBeNull();
  });
});