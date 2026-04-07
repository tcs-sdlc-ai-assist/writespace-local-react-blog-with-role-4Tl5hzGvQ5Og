# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2024-01-15

### Added

- **Public Landing Page**: Welcome page with project overview and navigation to login/register.
- **Authentication**:
  - User registration with display name, username, and password.
  - User login with username and password validation.
  - Session management with role-based access control.
  - Logout functionality with session cleanup.
- **Role-Based Access Control**:
  - `admin` role with full access to all features including user management.
  - `user` role with access to create, read, update, and delete own blog posts.
- **Blog CRUD**:
  - Create new blog posts with title and content.
  - View all published blog posts on the public feed.
  - Edit existing blog posts (restricted to post author or admin).
  - Delete blog posts (restricted to post author or admin).
  - Author name displayed on each post.
- **Admin Dashboard**:
  - Overview of all users and posts in the system.
  - Ability to manage and moderate all blog posts.
- **User Management** (Admin only):
  - View all registered users.
  - Assign or change user roles.
  - Remove user accounts.
- **localStorage Persistence**:
  - All user data persisted to localStorage.
  - All post data persisted to localStorage.
  - Session data persisted to localStorage for seamless page reloads.
- **Vercel Deployment**:
  - Production-ready Vite build configuration.
  - SPA fallback routing support via `vercel.json`.
  - Optimized static asset output for Vercel hosting.