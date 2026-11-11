import { useCallback, useEffect, useState } from 'react';
import { usersService } from '../services/users';

export default function useUsers({ page, pageSize, search } = {}) {
  const [result, setResult] = useState({
    key: null,
    users: [],
    total: 0,
    error: null,
  });
  const [revision, setRevision] = useState(0);
  const requestKey = JSON.stringify([page, pageSize, search, revision]);
  const loading = result.key !== requestKey;
  const users = result.users;
  const total = result.total;
  const error = result.key === requestKey ? result.error : null;

  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
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
        setResult({
          key: requestKey,
          users: results,
          total: count,
          error: null,
        });
      })
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError') {
          setResult({
            key: requestKey,
            users: [],
            total: 0,
            error: requestError,
          });
        }
      });

    return () => controller.abort();
  }, [page, pageSize, search, revision, requestKey]);

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
