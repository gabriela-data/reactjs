import axios from 'axios';
import {
  clearSession,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
  saveSession,
} from '../utils/authStorage';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const api = axios.create({ baseURL, timeout: 10000 });
let refreshRequest;

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

    if (status !== 401 || !request || request.skipAuthRefresh || request._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      clearSession();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
      return Promise.reject(error);
    }

    request._retry = true;
    refreshRequest ??= axios
      .post(
        `${baseURL}/auth/refresh`,
        { refreshToken },
        { timeout: 10000 }
      )
      .then(({ data }) => {
        const token = data?.token ?? data?.accessToken;
        const nextRefreshToken = data?.refreshToken ?? refreshToken;
        saveSession({
          token,
          refreshToken: nextRefreshToken,
          user: data?.user ?? data?.usuario ?? getStoredUser(),
        });
        return token;
      })
      .catch((refreshError) => {
        clearSession();
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
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
