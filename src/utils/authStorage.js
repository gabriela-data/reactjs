const TOKEN_KEY = '@vet:token';
const REFRESH_TOKEN_KEY = '@vet:refreshToken';
const USER_KEY = '@vet:user';
const SESSION_EVENT = 'cuidarvet:session';

export function normalizeRole(role) {
  if (typeof role !== 'string' || !role.trim()) {
    return 'user';
  }

  const normalized = role.trim().toLowerCase();
  if (normalized === 'admin' || normalized === 'user') {
    return normalized;
  }

  if (import.meta.env.DEV) {
    console.warn(`A API retornou um papel não esperado: "${role}".`);
  }

  return normalized;
}

export function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null;

  const rest = { ...user };
  delete rest.password;
  delete rest.senha;

  const displayName =
    typeof rest.name === 'string' && rest.name.trim()
      ? rest.name.trim()
      : typeof rest.nome === 'string' && rest.nome.trim()
        ? rest.nome.trim()
        : '';

  const normalizedUser = {
    ...rest,
    role: normalizeRole(rest.role ?? rest.tipo),
  };

  if (displayName) {
    normalizedUser.name = displayName;
    normalizedUser.nome = displayName;
  }

  return normalizedUser;
}

export function decodeTokenPayload(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(
      atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
    );
  } catch {
    return null;
  }
}

export function getUserFromToken(token) {
  const claims = decodeTokenPayload(token);
  if (!claims) return null;

  return normalizeUser({
    id: claims.sub ?? claims.id,
    email: claims.email,
    name: claims.name ?? claims.nome,
    role: claims.role,
  });
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

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)));
  } else if (user === null) {
    localStorage.removeItem(USER_KEY);
  }

  emitSessionChange();
}

export function saveStoredUser(user) {
  if (!user) return null;
  const normalized = normalizeUser(user);
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  emitSessionChange();
  return normalized;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emitSessionChange();
}

export function getTokenExpiry(token) {
  const claims = decodeTokenPayload(token);
  return Number.isFinite(claims?.exp) ? claims.exp * 1000 : null;
}

export function subscribeToSessionChange(callback) {
  window.addEventListener(SESSION_EVENT, callback);
  return () => window.removeEventListener(SESSION_EVENT, callback);
}
