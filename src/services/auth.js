import api from './api';
import { getStoredRefreshToken, getStoredUser, saveSession } from '../utils/authStorage';

function persistAuthResponse(data) {
  const token = data?.token ?? data?.accessToken;
  const user = data?.user ?? data?.usuario ?? data?.data?.user;
  const refreshToken = data?.refreshToken ?? data?.refresh_token;
  saveSession({ token, refreshToken, user });
  return user ?? null;
}

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials, {
    skipAuthRefresh: true,
  });
  return persistAuthResponse(data);
}

export async function register(user) {
  return api.post('/auth/register', user, { skipAuthRefresh: true });
}

export async function requestPasswordReset(email) {
  return api.post('/auth/forgot-password', { email }, { skipAuthRefresh: true });
}

export async function refreshAuthSession() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) throw new Error('Token de atualização não encontrado.');

  const { data } = await api.post(
    '/auth/refresh',
    { refreshToken },
    { skipAuthRefresh: true }
  );
  const token = data?.token ?? data?.accessToken;
  const nextRefreshToken = data?.refreshToken ?? refreshToken;
  const user = data?.user ?? data?.usuario ?? getStoredUser();
  saveSession({ token, refreshToken: nextRefreshToken, user });
  return user;
}
