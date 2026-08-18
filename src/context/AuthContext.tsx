import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useData } from '@/context/DataContext';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  isEditor: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { users } = useData();

  useEffect(() => {
    // Auto-login: bypass the login screen entirely and sign in as the
    // default admin account so the app (including /admin) opens directly.
    const autoAdmin = users.find((u: User) => u.role === 'admin') || {
      id: 'admin-main',
      username: 'urimi1806',
      password: '1806',
      role: 'admin',
    } as User;
    setCurrentUser(autoAdmin);
    localStorage.setItem('ffk_auth_user', JSON.stringify(autoAdmin));
  }, [users]);

  const login = (username: string, password: string): boolean => {
    const user = users.find((u: User) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('ffk_auth_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ffk_auth_user');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      isAdmin: currentUser?.role === 'admin',
      isEditor: currentUser?.role === 'editor',
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
