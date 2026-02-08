import { useState, useEffect } from 'react';

const ADMIN_SESSION_KEY = 'bed_admin_session';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'bikaner2026';

interface AdminSession {
  username: string;
  timestamp: number;
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionData) {
        const session: AdminSession = JSON.parse(sessionData);
        // Session valid for 24 hours
        const isValid = Date.now() - session.timestamp < 24 * 60 * 60 * 1000;
        setIsAuthenticated(isValid);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple validation - in production this would be backend-verified
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const session: AdminSession = {
        username,
        timestamp: Date.now(),
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
