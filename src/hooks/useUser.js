import { useEffect, useState } from 'react';
import { usersService } from '../services/users';

export default function useUser(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    usersService
      .getById(id, { signal: controller.signal })
      .then(setUser)
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError') setError(requestError);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return { user, setUser, loading, error };
}
