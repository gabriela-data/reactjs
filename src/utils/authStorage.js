const TOKEN_KEY = '@vet:token';
const REFRESH_TOKEN_KEY = '@vet:refreshToken';
const USER_KEY = '@vet:user';
const SESSION_EVENT = 'cuidarvet:session';

export function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null;

  const normalizedUser = { ...user };
  if (typeof normalizedUser.role !== 'string' || !normalizedUser.role.trim()) {
    normalizedUser.role = 'user';
    if (import.meta.env.DEV) {
      console.warn(
        'A API não retornou o papel do usuário; usando "user" temporariamente.'
      );
    }
  } else if (!['admin', 'user'].includes(normalizedUser.role)) {
    if (import.meta.env.DEV) {
      console.warn(
        `A API retornou um papel não esperado: "${normalizedUser.role}".`
      );
    }
  }

  return normalizedUser;
}

function emitSessionChange() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;

  try {
    const user = normalizeUser(JSON.parse(stored));
    if (user && JSON.stringify(user) !== stored) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return user;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession({ token, refreshToken, user }) {
  if (!token) throw new Error('A API não retornou um token de acesso.');

  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)));
  else if (user === null) localStorage.removeItem(USER_KEY);
  emitSessionChange();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emitSessionChange();
}

export function getTokenExpiry(token) {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(
      atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
    );
    return Number.isFinite(claims.exp) ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function subscribeToSessionChange(callback) {
  window.addEventListener(SESSION_EVENT, callback);
  return () => window.removeEventListener(SESSION_EVENT, callback);
}
