import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../utils/types';
import { getUsers, saveUsers } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { UserRow } from '../components/UserRow';

const ADMIN_USER_ID = 'admin-001';

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const session = getCurrentUser();

  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/login');
      return;
    }
    setUsers(getUsers());
  }, [navigate, session]);

  if (!session || session.role !== 'admin') {
    return null;
  }

  function refreshUsers() {
    setUsers(getUsers());
  }

  function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName) {
      setFormError('Display name is required.');
      return;
    }
    if (!trimmedUsername) {
      setFormError('Username is required.');
      return;
    }
    if (trimmedUsername.length < 3) {
      setFormError('Username must be at least 3 characters.');
      return;
    }
    if (!trimmedPassword) {
      setFormError('Password is required.');
      return;
    }
    if (trimmedPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (trimmedUsername === 'admin') {
      setFormError('Username "admin" is reserved.');
      return;
    }

    const currentUsers = getUsers();
    const exists = currentUsers.find((u) => u.username === trimmedUsername);
    if (exists) {
      setFormError('A user with that username already exists.');
      return;
    }

    const newUser: User = {
      id: generateId(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...currentUsers, newUser]);
    refreshUsers();
    resetForm();
  }

  function resetForm() {
    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setFormError('');
    setShowCreateForm(false);
  }

  function handleDeleteRequest(userId: string) {
    setDeleteConfirm(userId);
  }

  function handleDeleteConfirm() {
    if (!deleteConfirm) return;
    const currentUsers = getUsers();
    const updated = currentUsers.filter((u) => u.id !== deleteConfirm);
    saveUsers(updated);
    refreshUsers();
    setDeleteConfirm(null);
  }

  function handleDeleteCancel() {
    setDeleteConfirm(null);
  }

  const deleteTargetUser = deleteConfirm
    ? users.find((u) => u.id === deleteConfirm)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {users.length} registered {users.length === 1 ? 'user' : 'users'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ Create User'}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-8 rounded-2xl bg-white shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="rounded-2xl bg-white shadow-md border border-gray-100 p-8 text-center">
              <p className="text-gray-500 text-sm">No registered users yet.</p>
            </div>
          ) : (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onDelete={handleDeleteRequest}
                currentUserId={session.userId}
                isHardCodedAdmin={user.id === ADMIN_USER_ID}
              />
            ))
          )}
        </div>
      </div>

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900">
                {deleteTargetUser ? deleteTargetUser.displayName : 'this user'}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}