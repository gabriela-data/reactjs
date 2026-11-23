import api from './api';
import {
  getStoredRefreshToken,
  getStoredUser,
  getUserFromToken,
  normalizeUser,
  saveSession,
  saveStoredUser,
} from '../utils/authStorage';

export async function fetchCurrentUser(config = {}) {
  const { data: me } = await api.get('/users/me', config);
  let fullUser = me;

  // O endpoint /users/me pode retornar apenas { id, email, role } sem name;
  // buscamos /users/:id para preencher o nome completo do usuário autenticado.
  if (me?.id && !me?.name && !me?.nome) {
    try {
      const { data: details } = await api.get(`/users/${me.id}`, config);
      fullUser = { ...me, ...details };
    } catch (error) {
      if (error?.name === 'CanceledError') throw error;
      // Mantém os dados de /users/me caso a consulta detalhada falhe.
    }
  }

  return saveStoredUser(normalizeUser(fullUser));
}

export async function login({ email, senha, password }) {
  const { data } = await api.post(
    '/auth/login',
    {
      email: email.trim(),
      password: password ?? senha,
    },
    { skipAuthRefresh: true }
  );

  const body = data?.data ?? data;
  const token = body?.access_token ?? body?.token ?? body?.accessToken;
  const refreshToken = body?.refresh_token ?? body?.refreshToken;
  const initialUser =
    body?.user ?? body?.usuario ?? getUserFromToken(token) ?? null;

  saveSession({ token, refreshToken, user: initialUser });

  try {
    return (await fetchCurrentUser()) ?? getStoredUser();
  } catch {
    return getStoredUser();
  }
}

export async function register({ nome, name, email, senha, password }) {
  const payload = {
    name: (name ?? nome ?? '').trim(),
    email: email.trim(),
    password: password ?? senha,
  };

  const { data } = await api.post('/users', payload, {
    skipAuthRefresh: true,
  });
  return normalizeUser(data);
}

export async function requestPasswordReset(email) {
  const { data } = await api.post(
    '/auth/forgot-password',
    { email: email.trim() },
    { skipAuthRefresh: true }
  );
  return data;
}

export async function resetPassword({ token, senha, password }) {
  const { data } = await api.post(
    '/auth/reset-password',
    {
      token: token.trim(),
      password: password ?? senha,
    },
    { skipAuthRefresh: true }
  );
  return data;
}

export async function refreshAuthSession() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) throw new Error('Token de atualização não encontrado.');

  const { data } = await api.post(
    '/auth/refresh',
    { refreshToken },
    { skipAuthRefresh: true }
  );
  const token = data?.access_token ?? data?.token ?? data?.accessToken;
  const nextRefreshToken =
    data?.refresh_token ?? data?.refreshToken ?? refreshToken;
  const user = data?.user ?? data?.usuario ?? getStoredUser();
  saveSession({ token, refreshToken: nextRefreshToken, user });
  return getStoredUser();
}
