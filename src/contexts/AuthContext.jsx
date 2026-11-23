import { useCallback, useEffect, useState } from 'react';
import { notify } from '../services/notification';
import {
  fetchCurrentUser,
  login as loginRequest,
  refreshAuthSession,
} from '../services/auth';
import {
  clearSession,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
  getTokenExpiry,
  saveStoredUser,
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
    const authenticatedUser = await loginRequest({ email, senha });
    syncSession();
    return authenticatedUser;
  };

  const updateUser = (nextUser) => {
    if (!nextUser) return;
    saveStoredUser({
      ...user,
      ...nextUser,
      role: nextUser.role ?? user?.role ?? 'user',
    });
  };

  useEffect(() => {
    if (!token) return undefined;

    const expiresAt = getTokenExpiry(token);
    if (expiresAt && expiresAt <= Date.now()) {
      return undefined;
    }

    const controller = new AbortController();
    fetchCurrentUser({ signal: controller.signal }).catch(() => {
      // Erros 401 são tratados pelo interceptor; cancelamentos e falhas de rede mantêm o cache local.
    });

    return () => controller.abort();
  }, [token]);

  useEffect(() => {
    const expiresAt = getTokenExpiry(token);
    if (!token || !expiresAt) return undefined;

    const handleExpiry = async () => {
      if (getStoredRefreshToken()) {
        try {
          await refreshAuthSession();
          return;
        } catch {
          // Segue para encerrar a sessão caso o refresh falhe.
        }
      }

      logout();
      notify.warning('Sua sessão expirou. Entre novamente.');
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
        role: user?.role ?? 'user',
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: Boolean(token),
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
