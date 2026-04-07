import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';
import * as storage from '../utils/storage';
import * as auth from '../utils/auth';
import { Post, Session } from '../utils/types';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

const mockPost1: Post = {
  id: 'post-1',
  title: 'First Blog Post',
  content: 'This is the content of the first blog post with enough text to display properly.',
  createdAt: '2024-01-15T00:00:00.000Z',
  authorId: 'user-1',
  authorName: 'Alice',
};

const mockPost2: Post = {
  id: 'post-2',
  title: 'Second Blog Post',
  content: 'This is the content of the second blog post with enough text to display properly.',
  createdAt: '2024-01-16T00:00:00.000Z',
  authorId: 'user-2',
  authorName: 'Bob',
};

const mockPost3: Post = {
  id: 'post-3',
  title: 'Third Blog Post',
  content: 'This is the content of the third blog post with enough text to display properly.',
  createdAt: '2024-01-17T00:00:00.000Z',
  authorId: 'user-3',
  authorName: 'Charlie',
};

const mockPost4: Post = {
  id: 'post-4',
  title: 'Fourth Blog Post',
  content: 'This is the content of the fourth blog post with enough text to display properly.',
  createdAt: '2024-01-18T00:00:00.000Z',
  authorId: 'user-4',
  authorName: 'Diana',
};

const mockUserSession: Session = {
  userId: 'user-1',
  username: 'alice',
  displayName: 'Alice',
  role: 'user',
};

const mockAdminSession: Session = {
  userId: 'admin-001',
  username: 'admin',
  displayName: 'Administrator',
  role: 'admin',
};

function renderLandingPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  describe('hero section', () => {
    it('renders the main heading with WriteSpace branding', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText(/Welcome to/)).toBeInTheDocument();
      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
    });

    it('renders the hero description text', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(
        screen.getByText(/A modern blogging platform where you can share your thoughts/)
      ).toBeInTheDocument();
    });

    it('renders the hero emoji icon', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('📝')).toBeInTheDocument();
    });
  });

  describe('CTA buttons for guest users', () => {
    it('renders Get Started and Login buttons when not authenticated', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      const getStartedLink = screen.getByRole('link', { name: /Get Started/i });
      expect(getStartedLink).toBeInTheDocument();
      expect(getStartedLink).toHaveAttribute('href', '/register');

      const loginLinks = screen.getAllByRole('link', { name: /^Login$/i });
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('does not render Go to Dashboard button when not authenticated', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.queryByRole('link', { name: /Go to Dashboard/i })).not.toBeInTheDocument();
    });
  });

  describe('CTA buttons for authenticated regular user', () => {
    it('renders Go to Dashboard button linking to /home for regular user', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockUserSession);

      renderLandingPage();

      const dashboardLink = screen.getByRole('link', { name: /Go to Dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/home');
    });

    it('does not render Get Started button when authenticated', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockUserSession);

      renderLandingPage();

      expect(screen.queryByRole('link', { name: /Get Started/i })).not.toBeInTheDocument();
    });
  });

  describe('CTA buttons for authenticated admin user', () => {
    it('renders Go to Dashboard button linking to /admin for admin user', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockAdminSession);

      renderLandingPage();

      const dashboardLink = screen.getByRole('link', { name: /Go to Dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/admin');
    });
  });

  describe('features section', () => {
    it('renders the Why WriteSpace heading', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('renders the Easy Writing feature card', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('Easy Writing')).toBeInTheDocument();
      expect(
        screen.getByText(/Create and publish blog posts with a clean, distraction-free editor/)
      ).toBeInTheDocument();
    });

    it('renders the Role-Based Access feature card', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
      expect(
        screen.getByText(/Admins manage users and all content/)
      ).toBeInTheDocument();
    });

    it('renders the Local Storage feature card', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('Local Storage')).toBeInTheDocument();
      expect(
        screen.getByText(/All your data is stored securely in your browser/)
      ).toBeInTheDocument();
    });

    it('renders all three feature icons', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('✍️')).toBeInTheDocument();
      expect(screen.getByText('🔐')).toBeInTheDocument();
      expect(screen.getByText('💾')).toBeInTheDocument();
    });
  });

  describe('latest posts section with no posts', () => {
    it('renders the Latest Posts heading', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    });

    it('displays empty state when there are no posts', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(
        screen.getByText(/Be the first to share your thoughts/)
      ).toBeInTheDocument();
    });

    it('renders Start Writing link in empty state for guest users', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      const startWritingLink = screen.getByRole('link', { name: /Start Writing/i });
      expect(startWritingLink).toBeInTheDocument();
      expect(startWritingLink).toHaveAttribute('href', '/register');
    });

    it('does not render Start Writing link in empty state for authenticated users', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockUserSession);

      renderLandingPage();

      expect(screen.queryByRole('link', { name: /Start Writing/i })).not.toBeInTheDocument();
    });
  });

  describe('latest posts section with posts', () => {
    it('renders posts when they exist', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost1, mockPost2]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    });

    it('renders author names on posts', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost1]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('renders posts sorted by date descending (newest first)', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost1, mockPost2, mockPost3]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      const titles = screen.getAllByRole('heading', { level: 3 });
      expect(titles[0]).toHaveTextContent('Third Blog Post');
      expect(titles[1]).toHaveTextContent('Second Blog Post');
      expect(titles[2]).toHaveTextContent('First Blog Post');
    });

    it('displays at most 3 recent posts', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([
        mockPost1,
        mockPost2,
        mockPost3,
        mockPost4,
      ]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByText('Fourth Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
      expect(screen.queryByText('First Blog Post')).not.toBeInTheDocument();
    });

    it('renders Read more links for each post', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost1, mockPost2]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      const readMoreLinks = screen.getAllByText('Read more →');
      expect(readMoreLinks).toHaveLength(2);
    });

    it('does not show empty state when posts exist', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([mockPost1]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(screen.queryByText('No posts yet')).not.toBeInTheDocument();
    });
  });

  describe('footer', () => {
    it('renders the footer with WriteSpace branding', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(
        screen.getByText('A modern blogging platform for everyone.')
      ).toBeInTheDocument();
    });

    it('renders the copyright text', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      const currentYear = new Date().getFullYear().toString();
      expect(
        screen.getByText(new RegExp(`© ${currentYear} WriteSpace`))
      ).toBeInTheDocument();
    });

    it('renders Login and Register links in footer for guest users', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      const footerLoginLinks = screen.getAllByRole('link', { name: /^Login$/i });
      expect(footerLoginLinks.length).toBeGreaterThanOrEqual(1);

      const registerLinks = screen.getAllByRole('link', { name: /Register/i });
      expect(registerLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Blogs and Write links in footer for authenticated users', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockUserSession);

      renderLandingPage();

      const blogsLink = screen.getByRole('link', { name: /^Blogs$/i });
      expect(blogsLink).toBeInTheDocument();
      expect(blogsLink).toHaveAttribute('href', '/home');

      const writeLink = screen.getByRole('link', { name: /^Write$/i });
      expect(writeLink).toBeInTheDocument();
      expect(writeLink).toHaveAttribute('href', '/blog/new');
    });

    it('renders Dashboard link in footer for admin users', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockAdminSession);

      renderLandingPage();

      const dashboardLink = screen.getByRole('link', { name: /^Dashboard$/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/admin');
    });

    it('does not render Dashboard link in footer for regular users', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockUserSession);

      renderLandingPage();

      expect(screen.queryByRole('link', { name: /^Dashboard$/i })).not.toBeInTheDocument();
    });
  });

  describe('public navbar', () => {
    it('renders the public navbar for guest users', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      const navGetStartedLinks = screen.getAllByRole('link', { name: /Get Started/i });
      expect(navGetStartedLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('does not render the public navbar for authenticated users', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(mockUserSession);

      const { container } = renderLandingPage();

      // The PublicNavbar renders a nav with Login and Get Started links
      // When authenticated, those nav links should not be present
      expect(screen.queryByRole('link', { name: /Get Started/i })).not.toBeInTheDocument();
    });
  });

  describe('latest posts section description', () => {
    it('renders the latest posts section description', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(
        screen.getByText('See what the community has been writing about recently.')
      ).toBeInTheDocument();
    });
  });

  describe('features section description', () => {
    it('renders the features section description', () => {
      vi.spyOn(storage, 'getPosts').mockReturnValue([]);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLandingPage();

      expect(
        screen.getByText('Everything you need to start blogging, right in your browser.')
      ).toBeInTheDocument();
    });
  });
});