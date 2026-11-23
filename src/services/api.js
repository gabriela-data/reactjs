import axios from 'axios';
import {
  clearSession,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
  saveSession,
} from '../utils/authStorage';
import { isDevelopmentAuthBypass } from '../utils/devAuth';
import { notify } from './notification';

const baseURL = (
  import.meta.env.VITE_API_URL || 'https://vet-7uu3.onrender.com'
).replace(/\/+$/, '');

const api = axios.create({ baseURL, timeout: 45000 });
let refreshRequest;

const PUBLIC_PATHS = ['/login', '/cadastro', '/recuperar-senha'];

function redirectToLoginIfNeeded() {
  if (!PUBLIC_PATHS.includes(window.location.pathname)) {
    window.location.assign('/login');
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const status = error.response?.status;

    if (status === 403) {
      notify.error('Você não tem permissão para acessar este recurso.');
      return Promise.reject(error);
    }

    if (isDevelopmentAuthBypass && status === 401) {
      return Promise.reject(error);
    }

    if (
      status !== 401 ||
      !request ||
      request.skipAuthRefresh ||
      request._retry
    ) {
      return Promise.reject(error);
    }

    // O backend NestJS lança 401 UnauthorizedException('usuário não autorizado')
    // para erros de permissão em /users/:id; nesses casos a sessão ainda é válida.
    const serverMessage = error.response?.data?.message;
    if (
      typeof serverMessage === 'string' &&
      serverMessage.toLowerCase().includes('não autorizado')
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      clearSession();
      redirectToLoginIfNeeded();
      return Promise.reject(error);
    }

    request._retry = true;
    refreshRequest ??= axios
      .post(`${baseURL}/auth/refresh`, { refreshToken }, { timeout: 30000 })
      .then(({ data }) => {
        const token = data?.access_token ?? data?.token ?? data?.accessToken;
        const nextRefreshToken =
          data?.refresh_token ?? data?.refreshToken ?? refreshToken;
        saveSession({
          token,
          refreshToken: nextRefreshToken,
          user: data?.user ?? data?.usuario ?? getStoredUser(),
        });
        return token;
      })
      .catch((refreshError) => {
        clearSession();
        redirectToLoginIfNeeded();
        throw refreshError;
      })
      .finally(() => {
        refreshRequest = null;
      });

    try {
      const token = await refreshRequest;
      request.headers.Authorization = `Bearer ${token}`;
      return api(request);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
