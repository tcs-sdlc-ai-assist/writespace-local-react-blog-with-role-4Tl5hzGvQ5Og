import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as auth from '../utils/auth';
import * as storage from '../utils/storage';
import { Session } from '../utils/types';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  mockNavigate.mockReset();
});

describe('LoginPage', () => {
  describe('rendering', () => {
    it('renders the login form with username and password fields', () => {
      renderLoginPage();

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders the page heading', () => {
      renderLoginPage();

      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in to your writespace account/i)).toBeInTheDocument();
    });

    it('renders a link to the registration page', () => {
      renderLoginPage();

      const registerLink = screen.getByRole('link', { name: /create one here/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('renders the WriteSpace brand link', () => {
      renderLoginPage();

      const brandLink = screen.getByRole('link', { name: /writespace/i });
      expect(brandLink).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('shows an error when username is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'somepassword');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });

    it('shows an error when password is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'testuser');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    it('shows an error when both fields are empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  describe('successful login', () => {
    it('redirects admin to /admin on successful login', async () => {
      const user = userEvent.setup();
      const adminSession: Session = {
        userId: 'admin-001',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      };
      vi.spyOn(auth, 'login').mockReturnValue(adminSession);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin123');
      await user.click(submitButton);

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('redirects regular user to /blogs on successful login', async () => {
      const user = userEvent.setup();
      const userSession: Session = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      vi.spyOn(auth, 'login').mockReturnValue(userSession);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  describe('failed login', () => {
    it('displays an error message when login fails', async () => {
      const user = userEvent.setup();
      vi.spyOn(auth, 'login').mockReturnValue(null);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });

    it('re-enables the submit button after a failed login', async () => {
      const user = userEvent.setup();
      vi.spyOn(auth, 'login').mockReturnValue(null);
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled();
      });
    });
  });

  describe('authenticated user redirect', () => {
    it('redirects an authenticated admin to /admin', () => {
      const adminSession: Session = {
        userId: 'admin-001',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      };
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(adminSession);

      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('redirects an authenticated regular user to /blogs', () => {
      const userSession: Session = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(userSession);

      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  describe('form interaction', () => {
    it('allows typing in the username field', async () => {
      const user = userEvent.setup();
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'myusername');

      expect(usernameInput).toHaveValue('myusername');
    });

    it('allows typing in the password field', async () => {
      const user = userEvent.setup();
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);

      renderLoginPage();

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'mypassword');

      expect(passwordInput).toHaveValue('mypassword');
    });

    it('clears previous error when submitting again', async () => {
      const user = userEvent.setup();
      vi.spyOn(auth, 'getCurrentUser').mockReturnValue(null);
      vi.spyOn(auth, 'login').mockReturnValueOnce(null);

      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();

      const userSession: Session = {
        userId: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      vi.spyOn(auth, 'login').mockReturnValueOnce(userSession);

      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });
});