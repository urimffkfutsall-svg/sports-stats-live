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
    const saved = localStorage.getItem('ffk_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Verify user still exists in the database
        const found = users.find((u: User) => u.id === parsed.id && u.username === parsed.username);
        if (found) {
          setCurrentUser(found);
        } else if (users.length === 0) {
          // Data not loaded yet, keep the saved user temporarily
          setCurrentUser(parsed);
        } else {
          localStorage.removeItem('ffk_auth_user');
          setCurrentUser(null);
        }
      } catch { /* ignore */ }
    }
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
