import { useCallback, useEffect, useState } from 'react';
import { usersService } from '../services/users';

export default function useUsers({ page, pageSize, search } = {}) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    usersService
      .list(
        {
          page,
          limit: pageSize,
          search: search?.trim() || undefined,
        },
        { signal: controller.signal }
      )
      .then(({ users: results, total: count }) => {
        setUsers(results);
        setTotal(count);
      })
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError') setError(requestError);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, pageSize, search, revision]);

  const createUser = async (user) => {
    const result = await usersService.create(user);
    refresh();
    return result;
  };
  const updateUser = async (id, user) => {
    const result = await usersService.update(id, user);
    refresh();
    return result;
  };
  const deleteUser = async (id) => {
    await usersService.remove(id);
    refresh();
  };

  return { users, total, loading, error, refresh, createUser, updateUser, deleteUser };
}
