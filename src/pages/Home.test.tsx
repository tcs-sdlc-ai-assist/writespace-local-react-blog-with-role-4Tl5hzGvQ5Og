import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import * as storage from '../utils/storage';
import * as auth from '../utils/auth';
import { Post, Session } from '../utils/types';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

const mockPost: Post = {
  id: 'post-1',
  title: 'First Blog Post',
  content: 'This is the content of the first blog post with enough text to display.',
  createdAt: '2024-01-15T00:00:00.000Z',
  authorId: 'user-1',
  authorName: 'Test User',
};

const mockPost2: Post = {
  id: 'post-2',
  title: 'Second Blog Post',
  content: 'This is the content of the second blog post with enough text to display.',
  createdAt: '2024-01-16T00:00:00.000Z',
  authorId: 'user-2',
  authorName: 'Another User',
};

const mockUserSession: Session = {
  userId: 'user-1',
  username: 'testuser',
  displayName: 'Test User',
  role: 'user',
};

const mockAdminSession: Session = {
  userId: 'admin-001',
  username: 'admin',
  displayName: 'Administrator',
  role: 'admin',
};

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home', () => {
  describe('empty state', () => {
    it('displays empty state when there are no posts', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(
        screen.getByText(/Be the first to share your thoughts/)
      ).toBeInTheDocument();
      expect(screen.getByText('Create Your First Post')).toBeInTheDocument();
    });

    it('shows the Write Post button in the header even with no posts', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderHome();

      expect(screen.getByText('Write Post')).toBeInTheDocument();
    });
  });

  describe('blog grid rendering', () => {
    it('renders posts when they exist', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost, mockPost2]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderHome();

      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    });

    it('renders author names on posts', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderHome();

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('renders posts sorted by date descending (newest first)', () => {
      const olderPost: Post = {
        ...mockPost,
        id: 'post-old',
        title: 'Older Post',
        createdAt: '2024-01-10T00:00:00.000Z',
      };
      const newerPost: Post = {
        ...mockPost2,
        id: 'post-new',
        title: 'Newer Post',
        createdAt: '2024-01-20T00:00:00.000Z',
      };

      vi.spyOn(storage, 'getPosts').mockReturnValue([olderPost, newerPost]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderHome();

      const titles = screen.getAllByRole('heading', { level: 3 });
      expect(titles[0]).toHaveTextContent('Newer Post');
      expect(titles[1]).toHaveTextContent('Older Post');
    });

    it('renders Read more links for each post', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost, mockPost2]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderHome();

      const readMoreLinks = screen.getAllByText('Read more →');
      expect(readMoreLinks).toHaveLength(2);
    });

    it('displays the page heading and description', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderHome();

      expect(screen.getByText('All Posts')).toBeInTheDocument();
      expect(
        screen.getByText('Browse the latest posts from the community')
      ).toBeInTheDocument();
    });
  });

  describe('responsive layout classes', () => {
    it('renders the grid container with responsive classes when posts exist', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      const { container } = renderHome();

      const gridElement = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      );
      expect(gridElement).toBeInTheDocument();
    });
  });

  describe('edit icon visibility based on role/ownership', () => {
    it('shows edit icon for the post author', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockUserSession);

      renderHome();

      const editLink = screen.getByLabelText('Edit post "First Blog Post"');
      expect(editLink).toBeInTheDocument();
    });

    it('does not show edit icon for a different user who is not the author', () => {
      const otherUserSession: Session = {
        userId: 'user-99',
        username: 'otheruser',
        displayName: 'Other User',
        role: 'user',
      };

      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(otherUserSession);

      renderHome();

      const editLink = screen.queryByLabelText('Edit post "First Blog Post"');
      expect(editLink).not.toBeInTheDocument();
    });

    it('shows edit icon for admin on any post', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockAdminSession);

      renderHome();

      const editLink = screen.getByLabelText('Edit post "First Blog Post"');
      expect(editLink).toBeInTheDocument();
    });

    it('shows edit icons for admin on all posts', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost, mockPost2]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockAdminSession);

      renderHome();

      const editLink1 = screen.getByLabelText('Edit post "First Blog Post"');
      const editLink2 = screen.getByLabelText('Edit post "Second Blog Post"');
      expect(editLink1).toBeInTheDocument();
      expect(editLink2).toBeInTheDocument();
    });

    it('does not show edit icon when no user is logged in', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderHome();

      const editLink = screen.queryByLabelText('Edit post "First Blog Post"');
      expect(editLink).not.toBeInTheDocument();
    });

    it('shows edit icon only for own posts when logged in as regular user', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost, mockPost2]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockUserSession);

      renderHome();

      const editLink1 = screen.getByLabelText('Edit post "First Blog Post"');
      expect(editLink1).toBeInTheDocument();

      const editLink2 = screen.queryByLabelText('Edit post "Second Blog Post"');
      expect(editLink2).not.toBeInTheDocument();
    });
  });
});