import { useCallback, useEffect, useMemo, useState } from 'react';
import { usersService } from '../services/users';

export default function useUsers({ page = 1, pageSize = 10, search = '' } = {}) {
  const [result, setResult] = useState({
    revision: -1,
    users: [],
    total: 0,
    serverPaginated: false,
    error: null,
  });
  const [revision, setRevision] = useState(0);
  const loading = result.revision !== revision;
  const error = result.revision === revision ? result.error : null;

  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    usersService
      .list({ signal: controller.signal })
      .then(({ users: results, total: count, serverPaginated }) => {
        setResult({
          revision,
          users: results,
          total: count,
          serverPaginated,
          error: null,
        });
      })
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError') {
          setResult({
            revision,
            users: [],
            total: 0,
            serverPaginated: false,
            error: requestError,
          });
        }
      });

    return () => controller.abort();
  }, [revision]);

  const { users, total } = useMemo(() => {
    if (result.serverPaginated) {
      return { users: result.users, total: result.total };
    }

    const term = search.trim().toLowerCase();
    const filtered = term
      ? result.users.filter((item) => {
          const name = (item.name ?? item.nome ?? '').toLowerCase();
          const email = (item.email ?? '').toLowerCase();
          const roleLabel =
            item.role === 'admin' ? 'administrador admin' : 'usuário usuario user';
          return (
            name.includes(term) ||
            email.includes(term) ||
            roleLabel.includes(term)
          );
        })
      : result.users;

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;

    return {
      users: filtered.slice(start, start + pageSize),
      total: totalCount,
    };
  }, [result.users, result.total, result.serverPaginated, search, page, pageSize]);

  const createUser = async (user) => {
    const created = await usersService.create(user);
    refresh();
    return created;
  };

  const updateUser = async (id, user) => {
    const updated = await usersService.update(id, user);
    refresh();
    return updated;
  };

  const deleteUser = async (id) => {
    await usersService.remove(id);
    refresh();
  };

  return {
    users,
    total,
    loading,
    error,
    refresh,
    createUser,
    updateUser,
    deleteUser,
  };
}
