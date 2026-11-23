import api from './api';
import { normalizeUser } from '../utils/authStorage';

export function normalizeUsersResponse(data, responseHeaders = {}) {
  const isFlatArray = Array.isArray(data);
  const body = data?.data && !Array.isArray(data.data) ? data.data : data;
  const rawRows = isFlatArray
    ? data
    : (body?.usuarios ?? body?.users ?? body?.items ?? body?.data ?? []);
  const users = Array.isArray(rawRows)
    ? rawRows.map((item) => normalizeUser(item)).filter(Boolean)
    : [];

  const pagination = body?.pagination ?? body?.paginacao ?? {};
  const headerTotal = Number(responseHeaders['x-total-count']);
  const explicitTotal = Number(
    body?.total ??
      body?.totalItems ??
      body?.totalUsuarios ??
      pagination.total ??
      data?.total
  );

  const serverPaginated =
    !isFlatArray &&
    (Number.isFinite(explicitTotal) || Number.isFinite(headerTotal));

  return {
    users,
    total: Number.isFinite(explicitTotal)
      ? explicitTotal
      : Number.isFinite(headerTotal)
        ? headerTotal
        : users.length,
    serverPaginated,
  };
}

export const usersService = {
  async list(config = {}) {
    const response = await api.get('/users', config);
    return normalizeUsersResponse(response.data, response.headers);
  },

  async getById(id, config = {}) {
    const { data } = await api.get(`/users/${id}`, config);
    return normalizeUser(data?.usuario ?? data?.user ?? data?.data ?? data);
  },

  async create(user) {
    const payload = {
      name: (user.name ?? user.nome ?? '').trim(),
      email: (user.email ?? '').trim(),
      password: user.password ?? user.senha,
    };
    const { data } = await api.post('/users', payload);
    return normalizeUser(data?.usuario ?? data?.user ?? data);
  },

  async update(id, user) {
    const payload = {};
    const nextName = (user.name ?? user.nome)?.trim();
    const nextEmail = user.email?.trim();

    if (nextName) payload.name = nextName;
    if (nextEmail) payload.email = nextEmail;

    const { data } = await api.patch(`/users/${id}`, payload);
    return normalizeUser(data?.usuario ?? data?.user ?? data);
  },

  async remove(id) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};
