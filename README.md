# WriteSpace

A modern blogging platform built with React and TypeScript, featuring role-based access control for admin and user roles.

## Features

- **User Authentication** — Secure login and session management
- **Role-Based Access Control** — Admin and user roles with distinct permissions
- **Post Management** — Create, read, update, and delete blog posts
- **User Management** — Admin-level user administration
- **Responsive Design** — Tailwind CSS utility-first styling for all screen sizes
- **Fast Development** — Powered by Vite for instant HMR and optimized builds

## Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Testing:** Vitest + React Testing Library

## Folder Structure

```
writespace/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page-level route components
│   ├── services/            # API and business logic services
│   ├── utils/               # Shared utilities and type definitions
│   │   └── types.ts         # Core type contracts (User, Post, Session)
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and Tailwind directives
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root. All client-side environment variables must be prefixed with `VITE_`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Access environment variables in code via `import.meta.env.VITE_*`.

### Development

```bash
# Start the development server with hot module replacement
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### Build

```bash
# Create an optimized production build
npm run build
```

Output is generated in the `dist/` directory.

### Preview Production Build

```bash
# Serve the production build locally
npm run preview
```

### Testing

```bash
# Run the test suite
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage report
npm run test -- --coverage
```

### Linting

```bash
# Run the linter
npm run lint
```

## Usage Guide

### User Roles

WriteSpace supports two roles, defined as the `UserRole` type:

| Role    | Permissions                                                                 |
|---------|-----------------------------------------------------------------------------|
| `admin` | Full access — manage all posts, manage users, create/edit/delete any content |
| `user`  | Standard access — create own posts, edit/delete own posts, view all posts    |

### Admin Workflow

1. **Log in** with admin credentials.
2. **Manage Users** — View all registered users, assign roles, or remove accounts.
3. **Manage Posts** — View, edit, or delete any post across the platform.
4. **Create Posts** — Publish new blog posts visible to all users.

### User Workflow

1. **Register** or **log in** with user credentials.
2. **Browse Posts** — View all published posts from any author.
3. **Create Posts** — Write and publish your own blog posts.
4. **Edit/Delete Own Posts** — Modify or remove posts you have authored.

### Core Data Models

- **User** — `id`, `displayName`, `username`, `password`, `role`, `createdAt`
- **Post** — `id`, `title`, `content`, `createdAt`, `authorId`, `authorName`
- **Session** — `userId`, `username`, `displayName`, `role`

## Deployment

1. Run `npm run build` to generate the production bundle in `dist/`.
2. Deploy the contents of `dist/` to any static hosting provider (Vercel, Netlify, AWS S3 + CloudFront, GitHub Pages, etc.).
3. Ensure environment variables are configured in your hosting provider's settings.

## License

This project is **private and proprietary**. All rights reserved. No part of this software may be reproduced, distributed, or transmitted in any form without prior written permission from the project owner. Unauthorized use, copying, or distribution is strictly prohibited.