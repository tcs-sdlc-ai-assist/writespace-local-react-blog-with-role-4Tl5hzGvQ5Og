import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { getCurrentUser } from './utils/auth';
import { Session } from './utils/types';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import WriteBlog from './pages/WriteBlog';
import ReadBlog from './pages/ReadBlog';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

function AppLayout() {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const currentSession = getCurrentUser();
    setSession(currentSession);
  }, [location]);

  function handleLogout() {
    setSession(null);
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  const showNavbar = session && !isPublicRoute;

  return (
    <>
      {showNavbar && <Navbar session={session} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/blogs" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/write" element={<WriteBlog />} />
          <Route path="/blog/new" element={<WriteBlog />} />
          <Route path="/blog/:id/edit" element={<WriteBlog />} />
          <Route path="/edit/:id" element={<WriteBlog />} />
          <Route path="/blog/:id" element={<ReadBlog />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}