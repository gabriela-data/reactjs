import { useAuth } from '../contexts/auth';

export default function useRole() {
  const { role, isAdmin } = useAuth();
  return { role, isAdmin };
}
