import { User, UserRole, Session } from './types';
import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_DISPLAY_NAME = 'Administrator';
const ADMIN_USER_ID = 'admin-001';

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function login(username: string, password: string): Session | null {
  if (!username || !password) {
    return null;
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session: Session = {
      userId: ADMIN_USER_ID,
      username: ADMIN_USERNAME,
      displayName: ADMIN_DISPLAY_NAME,
      role: 'admin',
    };
    saveSession(session);
    return session;
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return null;
  }

  const session: Session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  saveSession(session);
  return session;
}

export function register(
  displayName: string,
  username: string,
  password: string
): Session | null {
  if (!displayName || !username || !password) {
    return null;
  }

  if (username === ADMIN_USERNAME) {
    return null;
  }

  const users = getUsers();
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return null;
  }

  const newUser: User = {
    id: generateId(),
    displayName,
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);

  const session: Session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };
  saveSession(session);
  return session;
}

export function logout(): void {
  clearSession();
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function getCurrentUser(): Session | null {
  return getSession();
}

export function hasRole(role: UserRole): boolean {
  const session = getSession();
  if (!session) {
    return false;
  }
  return session.role === role;
}

export function isOwner(authorId: string): boolean {
  const session = getSession();
  if (!session) {
    return false;
  }
  return session.userId === authorId;
}