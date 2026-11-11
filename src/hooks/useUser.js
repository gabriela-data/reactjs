import { useEffect, useState } from 'react';
import { usersService } from '../services/users';

export default function useUser(id) {
  const [result, setResult] = useState({ id: null, user: null, error: null });
  const loading = Boolean(id) && result.id !== id;
  const user = result.id === id ? result.user : null;
  const error = result.id === id ? result.error : null;

  useEffect(() => {
    if (!id) return undefined;

    const controller = new AbortController();
    usersService
      .getById(id, { signal: controller.signal })
      .then((loadedUser) => setResult({ id, user: loadedUser, error: null }))
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError') {
          setResult({ id, user: null, error: requestError });
        }
      });

    return () => controller.abort();
  }, [id]);

  return { user, loading, error };
}
