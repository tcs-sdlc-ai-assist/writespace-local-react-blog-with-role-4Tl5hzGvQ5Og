export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  displayName: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface Session {
  userId: string;
  username: string;
  displayName: string;
  role: UserRole;
}