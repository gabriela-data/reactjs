import api from './api';

export function normalizeUsersResponse(data, responseHeaders = {}) {
  const rows = Array.isArray(data)
    ? data
    : data?.usuarios ?? data?.users ?? data?.items ?? data?.data ?? [];
  const pagination = data?.pagination ?? data?.paginacao ?? {};
  const headerTotal = Number(responseHeaders['x-total-count']);
  const total = Number(
    data?.total ?? data?.totalItems ?? data?.totalUsuarios ?? pagination.total
  );

  return {
    users: Array.isArray(rows) ? rows : [],
    total: Number.isFinite(total)
      ? total
      : Number.isFinite(headerTotal)
        ? headerTotal
        : Array.isArray(rows)
          ? rows.length
          : 0,
  };
}

export const usersService = {
  async list(params = {}, config = {}) {
    const response = await api.get('/usuarios', { ...config, params });
    return normalizeUsersResponse(response.data, response.headers);
  },

  async getById(id, config = {}) {
    const { data } = await api.get(`/usuarios/${id}`, config);
    return data?.usuario ?? data?.user ?? data?.data ?? data;
  },

  async create(user) {
    const { data } = await api.post('/usuarios', user);
    return data?.usuario ?? data?.user ?? data;
  },

  async update(id, user) {
    const { data } = await api.put(`/usuarios/${id}`, user);
    return data?.usuario ?? data?.user ?? data;
  },

  async remove(id) {
    return api.delete(`/usuarios/${id}`);
  },
};
