import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  hasRole,
  isOwner,
} from './auth';
import { getUsers, getSession, saveUsers, saveSession, clearSession } from './storage';
import { Session, User } from './types';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('login', () => {
  it('returns a session for the hard-coded admin credentials', () => {
    const session = login('admin', 'admin123');
    expect(session).not.toBeNull();
    expect(session!.userId).toBe('admin-001');
    expect(session!.username).toBe('admin');
    expect(session!.displayName).toBe('Administrator');
    expect(session!.role).toBe('admin');
  });

  it('persists the admin session to localStorage', () => {
    login('admin', 'admin123');
    const session = getSession();
    expect(session).not.toBeNull();
    expect(session!.userId).toBe('admin-001');
  });

  it('returns null for incorrect admin password', () => {
    const session = login('admin', 'wrongpassword');
    expect(session).toBeNull();
  });

  it('returns a session for a valid registered user', () => {
    const mockUser: User = {
      id: 'user-1',
      displayName: 'Test User',
      username: 'testuser',
      password: 'password123',
      role: 'user',
      createdAt: '2024-01-15T00:00:00.000Z',
    };
    saveUsers([mockUser]);

    const session = login('testuser', 'password123');
    expect(session).not.toBeNull();
    expect(session!.userId).toBe('user-1');
    expect(session!.username).toBe('testuser');
    expect(session!.displayName).toBe('Test User');
    expect(session!.role).toBe('user');
  });

  it('persists the user session to localStorage after login', () => {
    const mockUser: User = {
      id: 'user-2',
      displayName: 'Another User',
      username: 'another',
      password: 'pass456',
      role: 'user',
      createdAt: '2024-01-15T00:00:00.000Z',
    };
    saveUsers([mockUser]);

    login('another', 'pass456');
    const session = getSession();
    expect(session).not.toBeNull();
    expect(session!.userId).toBe('user-2');
  });

  it('returns null for a non-existent username', () => {
    const session = login('nonexistent', 'password123');
    expect(session).toBeNull();
  });

  it('returns null for a wrong password on a registered user', () => {
    const mockUser: User = {
      id: 'user-1',
      displayName: 'Test User',
      username: 'testuser',
      password: 'password123',
      role: 'user',
      createdAt: '2024-01-15T00:00:00.000Z',
    };
    saveUsers([mockUser]);

    const session = login('testuser', 'wrongpassword');
    expect(session).toBeNull();
  });

  it('returns null when username is empty', () => {
    const session = login('', 'password123');
    expect(session).toBeNull();
  });

  it('returns null when password is empty', () => {
    const session = login('admin', '');
    expect(session).toBeNull();
  });

  it('returns null when both username and password are empty', () => {
    const session = login('', '');
    expect(session).toBeNull();
  });
});

describe('register', () => {
  it('creates a new user and returns a session', () => {
    const session = register('New User', 'newuser', 'newpass123');
    expect(session).not.toBeNull();
    expect(session!.username).toBe('newuser');
    expect(session!.displayName).toBe('New User');
    expect(session!.role).toBe('user');
  });

  it('persists the new user to localStorage', () => {
    register('New User', 'newuser', 'newpass123');
    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('newuser');
    expect(users[0].displayName).toBe('New User');
    expect(users[0].role).toBe('user');
  });

  it('persists the session to localStorage after registration', () => {
    register('New User', 'newuser', 'newpass123');
    const session = getSession();
    expect(session).not.toBeNull();
    expect(session!.username).toBe('newuser');
  });

  it('assigns a unique id and createdAt to the new user', () => {
    register('New User', 'newuser', 'newpass123');
    const users = getUsers();
    expect(users[0].id).toBeTruthy();
    expect(users[0].createdAt).toBeTruthy();
  });

  it('returns null when registering with an existing username', () => {
    const existingUser: User = {
      id: 'user-1',
      displayName: 'Existing User',
      username: 'existinguser',
      password: 'password123',
      role: 'user',
      createdAt: '2024-01-15T00:00:00.000Z',
    };
    saveUsers([existingUser]);

    const session = register('Another User', 'existinguser', 'newpass');
    expect(session).toBeNull();
  });

  it('does not add a duplicate user to localStorage', () => {
    const existingUser: User = {
      id: 'user-1',
      displayName: 'Existing User',
      username: 'existinguser',
      password: 'password123',
      role: 'user',
      createdAt: '2024-01-15T00:00:00.000Z',
    };
    saveUsers([existingUser]);

    register('Another User', 'existinguser', 'newpass');
    const users = getUsers();
    expect(users).toHaveLength(1);
  });

  it('returns null when registering with the admin username', () => {
    const session = register('Fake Admin', 'admin', 'admin123');
    expect(session).toBeNull();
  });

  it('returns null when displayName is empty', () => {
    const session = register('', 'newuser', 'newpass123');
    expect(session).toBeNull();
  });

  it('returns null when username is empty', () => {
    const session = register('New User', '', 'newpass123');
    expect(session).toBeNull();
  });

  it('returns null when password is empty', () => {
    const session = register('New User', 'newuser', '');
    expect(session).toBeNull();
  });

  it('allows multiple unique registrations', () => {
    register('User One', 'userone', 'pass1');
    register('User Two', 'usertwo', 'pass2');
    const users = getUsers();
    expect(users).toHaveLength(2);
    expect(users[0].username).toBe('userone');
    expect(users[1].username).toBe('usertwo');
  });

  it('sets the role to user for new registrations', () => {
    const session = register('New User', 'newuser', 'newpass123');
    expect(session!.role).toBe('user');
    const users = getUsers();
    expect(users[0].role).toBe('user');
  });
});

describe('logout', () => {
  it('clears the session from localStorage', () => {
    login('admin', 'admin123');
    expect(getSession()).not.toBeNull();
    logout();
    expect(getSession()).toBeNull();
  });

  it('does not throw when no session exists', () => {
    expect(() => logout()).not.toThrow();
  });
});

describe('isAuthenticated', () => {
  it('returns true when a session exists', () => {
    login('admin', 'admin123');
    expect(isAuthenticated()).toBe(true);
  });

  it('returns false when no session exists', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('returns false after logout', () => {
    login('admin', 'admin123');
    logout();
    expect(isAuthenticated()).toBe(false);
  });
});

describe('getCurrentUser', () => {
  it('returns the current session when logged in', () => {
    login('admin', 'admin123');
    const user = getCurrentUser();
    expect(user).not.toBeNull();
    expect(user!.userId).toBe('admin-001');
    expect(user!.username).toBe('admin');
  });

  it('returns null when no session exists', () => {
    const user = getCurrentUser();
    expect(user).toBeNull();
  });

  it('returns null after logout', () => {
    login('admin', 'admin123');
    logout();
    const user = getCurrentUser();
    expect(user).toBeNull();
  });

  it('returns the correct session for a registered user', () => {
    register('Test User', 'testuser', 'password123');
    const user = getCurrentUser();
    expect(user).not.toBeNull();
    expect(user!.username).toBe('testuser');
    expect(user!.displayName).toBe('Test User');
    expect(user!.role).toBe('user');
  });
});

describe('hasRole', () => {
  it('returns true when the session role matches admin', () => {
    login('admin', 'admin123');
    expect(hasRole('admin')).toBe(true);
  });

  it('returns false when the session role does not match', () => {
    login('admin', 'admin123');
    expect(hasRole('user')).toBe(false);
  });

  it('returns true when the session role matches user', () => {
    register('Test User', 'testuser', 'password123');
    expect(hasRole('user')).toBe(true);
  });

  it('returns false when no session exists', () => {
    expect(hasRole('admin')).toBe(false);
    expect(hasRole('user')).toBe(false);
  });

  it('returns false after logout', () => {
    login('admin', 'admin123');
    logout();
    expect(hasRole('admin')).toBe(false);
  });
});

describe('isOwner', () => {
  it('returns true when the session userId matches the authorId', () => {
    login('admin', 'admin123');
    expect(isOwner('admin-001')).toBe(true);
  });

  it('returns false when the session userId does not match the authorId', () => {
    login('admin', 'admin123');
    expect(isOwner('user-999')).toBe(false);
  });

  it('returns false when no session exists', () => {
    expect(isOwner('admin-001')).toBe(false);
  });

  it('returns true for a registered user checking their own authorId', () => {
    register('Test User', 'testuser', 'password123');
    const session = getCurrentUser();
    expect(session).not.toBeNull();
    expect(isOwner(session!.userId)).toBe(true);
  });

  it('returns false for a registered user checking a different authorId', () => {
    register('Test User', 'testuser', 'password123');
    expect(isOwner('someone-else')).toBe(false);
  });

  it('returns false after logout', () => {
    login('admin', 'admin123');
    logout();
    expect(isOwner('admin-001')).toBe(false);
  });
});