import { useCallback, useEffect, useState } from 'react';
import { notify } from '../services/notification';
import { login as loginRequest, refreshAuthSession } from '../services/auth';
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  getTokenExpiry,
  subscribeToSessionChange,
} from '../utils/authStorage';
import { AuthContext } from './auth';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(getStoredUser);

  const syncSession = useCallback(() => {
    setToken(getStoredToken());
    setUser(getStoredUser());
  }, []);

  useEffect(() => subscribeToSessionChange(syncSession), [syncSession]);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const login = async (email, senha) => {
    await loginRequest({ email, senha });
    syncSession();
  };

  const updateUser = (nextUser) => {
    if (!nextUser) return;
    localStorage.setItem('@vet:user', JSON.stringify(nextUser));
    syncSession();
  };

  useEffect(() => {
    const expiresAt = getTokenExpiry(token);
    if (!token || !expiresAt) return undefined;

    const handleExpiry = async () => {
      try {
        await refreshAuthSession();
      } catch {
        logout();
        notify.warning('Sua sessão expirou. Entre novamente.');
      }
    };

    const delay = expiresAt - Date.now();
    if (delay <= 0) {
      handleExpiry();
      return undefined;
    }

    const timer = window.setTimeout(handleExpiry, delay);
    return () => window.clearTimeout(timer);
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
