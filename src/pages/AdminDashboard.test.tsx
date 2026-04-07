import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { saveUsers, savePosts, saveSession, clearSession } from '../utils/storage';
import { Session, User, Post } from '../utils/types';

const adminSession: Session = {
  userId: 'admin-001',
  username: 'admin',
  displayName: 'Administrator',
  role: 'admin',
};

const userSession: Session = {
  userId: 'user-1',
  username: 'testuser',
  displayName: 'Test User',
  role: 'user',
};

const mockUsers: User[] = [
  {
    id: 'user-1',
    displayName: 'Alice',
    username: 'alice',
    password: 'password123',
    role: 'user',
    createdAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 'user-2',
    displayName: 'Bob',
    username: 'bob',
    password: 'password456',
    role: 'user',
    createdAt: '2024-01-11T00:00:00.000Z',
  },
  {
    id: 'user-3',
    displayName: 'Charlie',
    username: 'charlie',
    password: 'password789',
    role: 'admin',
    createdAt: '2024-01-12T00:00:00.000Z',
  },
];

const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'First Post',
    content: 'Content of the first post',
    createdAt: '2024-01-10T00:00:00.000Z',
    authorId: 'user-1',
    authorName: 'Alice',
  },
  {
    id: 'post-2',
    title: 'Second Post',
    content: 'Content of the second post',
    createdAt: '2024-01-12T00:00:00.000Z',
    authorId: 'user-2',
    authorName: 'Bob',
  },
  {
    id: 'post-3',
    title: 'Third Post',
    content: 'Content of the third post',
    createdAt: '2024-01-14T00:00:00.000Z',
    authorId: 'admin-001',
    authorName: 'Administrator',
  },
];

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AdminDashboard />
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('AdminDashboard', () => {
  describe('access enforcement', () => {
    it('redirects non-admin users to /blogs', () => {
      saveSession(userSession);
      renderDashboard();
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('redirects unauthenticated users to /blogs', () => {
      renderDashboard();
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('does not redirect admin users', () => {
      saveSession(adminSession);
      renderDashboard();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('stat cards', () => {
    it('renders stat cards with correct counts', () => {
      saveSession(adminSession);
      saveUsers(mockUsers);
      savePosts(mockPosts);
      renderDashboard();

      expect(screen.getByText('Total Posts')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      // Total users = mockUsers.length + 1 (hard-coded admin) = 4
      expect(screen.getByText('4')).toBeInTheDocument();

      expect(screen.getByText('Admins')).toBeInTheDocument();
      // Admins = users with role admin (1) + 1 (hard-coded admin) = 2
      expect(screen.getByText('2')).toBeInTheDocument();

      expect(screen.getByText('Users')).toBeInTheDocument();
      // Users with role 'user' = 2
      const userCountElements = screen.getAllByText('2');
      expect(userCountElements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders correct counts when no users or posts exist', () => {
      saveSession(adminSession);
      renderDashboard();

      expect(screen.getByText('Total Posts')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      // Total users = 0 + 1 (hard-coded admin) = 1
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('welcome message', () => {
    it('displays the admin display name in the welcome message', () => {
      saveSession(adminSession);
      renderDashboard();

      expect(
        screen.getByText(/Welcome back, Administrator/)
      ).toBeInTheDocument();
    });
  });

  describe('quick action buttons', () => {
    it('renders the Write Post quick action link', () => {
      saveSession(adminSession);
      renderDashboard();

      const writePostLink = screen.getByRole('link', { name: /Write Post/i });
      expect(writePostLink).toBeInTheDocument();
      expect(writePostLink).toHaveAttribute('href', '/blog/new');
    });

    it('renders the Manage Users quick action link', () => {
      saveSession(adminSession);
      renderDashboard();

      const manageUsersLink = screen.getByRole('link', { name: /Manage Users/i });
      expect(manageUsersLink).toBeInTheDocument();
      expect(manageUsersLink).toHaveAttribute('href', '/admin/users');
    });
  });

  describe('recent posts section', () => {
    it('renders recent posts sorted by date descending', () => {
      saveSession(adminSession);
      savePosts(mockPosts);
      renderDashboard();

      const postLinks = screen.getAllByRole('link', {
        name: /First Post|Second Post|Third Post/,
      });
      expect(postLinks).toHaveLength(3);
      // Third Post (Jan 14) should appear first
      expect(postLinks[0]).toHaveTextContent('Third Post');
      expect(postLinks[1]).toHaveTextContent('Second Post');
      expect(postLinks[2]).toHaveTextContent('First Post');
    });

    it('shows empty state when no posts exist', () => {
      saveSession(adminSession);
      renderDashboard();

      expect(
        screen.getByText('No posts yet. Create your first post!')
      ).toBeInTheDocument();
    });

    it('displays at most 5 recent posts', () => {
      saveSession(adminSession);
      const manyPosts: Post[] = Array.from({ length: 8 }, (_, i) => ({
        id: `post-${i}`,
        title: `Post Number ${i}`,
        content: `Content for post ${i}`,
        createdAt: new Date(2024, 0, i + 1).toISOString(),
        authorId: 'user-1',
        authorName: 'Alice',
      }));
      savePosts(manyPosts);
      renderDashboard();

      const editButtons = screen.getAllByRole('link', { name: /^Edit post/ });
      expect(editButtons).toHaveLength(5);
    });

    it('renders edit links for each recent post', () => {
      saveSession(adminSession);
      savePosts(mockPosts);
      renderDashboard();

      const editLinks = screen.getAllByRole('link', { name: /^Edit post/ });
      expect(editLinks).toHaveLength(3);
      expect(editLinks[0]).toHaveAttribute('href', '/blog/post-3/edit');
      expect(editLinks[1]).toHaveAttribute('href', '/blog/post-2/edit');
      expect(editLinks[2]).toHaveAttribute('href', '/blog/post-1/edit');
    });

    it('renders delete buttons for each recent post', () => {
      saveSession(adminSession);
      savePosts(mockPosts);
      renderDashboard();

      const deleteButtons = screen.getAllByRole('button', { name: /^Delete post/ });
      expect(deleteButtons).toHaveLength(3);
    });

    it('deletes a post when the delete button is clicked', async () => {
      const user = userEvent.setup();
      saveSession(adminSession);
      savePosts(mockPosts);
      renderDashboard();

      const deleteButtons = screen.getAllByRole('button', { name: /^Delete post/ });
      // Delete the first displayed post (Third Post, most recent)
      await user.click(deleteButtons[0]);

      expect(screen.queryByText('Third Post')).not.toBeInTheDocument();
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('displays author name and date for each recent post', () => {
      saveSession(adminSession);
      savePosts([mockPosts[0]]);
      renderDashboard();

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument();
    });
  });

  describe('page heading', () => {
    it('renders the Admin Dashboard heading', () => {
      saveSession(adminSession);
      renderDashboard();

      expect(
        screen.getByRole('heading', { name: /Admin Dashboard/i, level: 1 })
      ).toBeInTheDocument();
    });
  });
});