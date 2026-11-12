import useRole from '../../hooks/useRole';

export default function Can({ role = 'admin', children, fallback = null }) {
  const { role: currentRole } = useRole();
  return currentRole === role ? children : fallback;
}
