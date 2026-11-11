import { useId, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  PawPrint,
  Settings,
  UsersRound,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/auth';

const defaultItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/usuarios', label: 'Usuários', icon: UsersRound },
  { to: '/perfil', label: 'Meu perfil', icon: UserRound },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

export default function Sidebar({
  items = defaultItems,
  brandName = 'CuidarVet',
  brandTo = '/dashboard',
  logo,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      aria-label="Menu lateral"
      className="flex w-full flex-col border-b border-gray-200 bg-white md:sticky md:top-0 md:h-dvh md:w-64 md:shrink-0 md:border-r md:border-b-0"
    >
      <header className="flex h-20 shrink-0 items-center justify-between gap-3 px-5">
        <Link
          to={brandTo}
          onClick={closeMenu}
          aria-label={`${brandName} - inicio`}
          className="flex min-w-0 items-center gap-3 rounded text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span aria-hidden="true" className="shrink-0">
            {logo ?? <PawPrint className="size-8" />}
          </span>
          <span className="truncate font-title text-xl font-semibold">
            {brandName}
          </span>
        </Link>
        <button
          type="button"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
        >
          {isOpen ? (
            <X aria-hidden="true" className="size-6" />
          ) : (
            <Menu aria-hidden="true" className="size-6" />
          )}
        </button>
      </header>

      <div
        id={menuId}
        className={`${isOpen ? 'flex' : 'hidden'} max-h-[calc(100dvh-5rem)] min-h-0 flex-col md:flex md:max-h-none md:flex-1`}
      >
        <nav
          aria-label="Navegacao principal"
          className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
        >
          <ul className="space-y-1">
            {items.map(({ to, label, icon: Icon, end = false }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  {Icon && (
                    <Icon aria-hidden="true" className="size-5 shrink-0" />
                  )}
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="shrink-0 border-t border-gray-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          >
            <LogOut aria-hidden="true" className="size-5 shrink-0" />
            <span>Sair</span>
          </button>
        </footer>
      </div>
    </aside>
  );
}
