import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../../contexts/auth';

const defaultBreadcrumbs = [{ label: 'Dashboard' }];

export default function Topbar({
  breadcrumbs = defaultBreadcrumbs,
  notificationCount = 0,
  onNotificationsClick,
  avatarUrl,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState(null);
  const accountRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownId = useId();
  const name = user?.nome?.trim() || user?.name?.trim() || 'Usuário';
  const nameParts = name.split(/\s+/);
  const initials =
    `${nameParts[0][0]}${nameParts.length > 1 ? nameParts.at(-1)[0] : ''}`.toLocaleUpperCase(
      'pt-BR'
    );
  const imageUrl = avatarUrl ?? user?.avatarUrl;
  const count = Number.isFinite(notificationCount)
    ? Math.max(0, Math.floor(notificationCount))
    : 0;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!accountRef.current.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex min-h-20 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          {breadcrumbs.map((item, index) => {
            const isCurrent = index === breadcrumbs.length - 1;

            return (
              <li
                key={`${item.to ?? item.label}-${index}`}
                className="flex min-w-0 items-center gap-1"
              >
                {index > 0 && (
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-gray-400"
                  />
                )}
                {!isCurrent && item.to ? (
                  <Link
                    to={item.to}
                    title={item.label}
                    className="max-w-32 truncate rounded text-gray-500 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:max-w-64"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isCurrent ? 'page' : undefined}
                    title={item.label}
                    className={`max-w-40 truncate sm:max-w-64 ${isCurrent ? 'font-medium text-gray-900' : 'text-gray-500'}`}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label={`Notificações: ${count} ${count === 1 ? 'não lida' : 'não lidas'}`}
          disabled={!onNotificationsClick}
          onClick={onNotificationsClick}
          className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Bell aria-hidden="true" className="size-6" />
          {count > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 min-w-5 rounded-full bg-danger px-1 text-center text-xs leading-5 font-semibold text-white"
            >
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>

        <div
          ref={accountRef}
          className="relative"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsOpen(false);
            }
          }}
        >
          <button
            ref={triggerRef}
            type="button"
            aria-label={`Menu da conta de ${name}`}
            aria-expanded={isOpen}
            aria-controls={dropdownId}
            onClick={() => setIsOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg p-1 text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary"
            >
              {imageUrl && failedAvatarUrl !== imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  className="size-full object-cover"
                  onError={() => setFailedAvatarUrl(imageUrl)}
                />
              ) : (
                initials
              )}
            </span>
            <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
              {name}
            </span>
            <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
          </button>

          <div
            id={dropdownId}
            hidden={!isOpen}
            className="absolute top-full right-0 z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
          >
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-900">
                {name}
              </p>
              {user?.email && (
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              )}
            </div>
            <nav aria-label="Menu da conta" className="space-y-1 p-2">
              <Link
                to="/perfil"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                <UserRound aria-hidden="true" className="size-4" />
                Meu perfil
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-danger"
              >
                <LogOut aria-hidden="true" className="size-4" />
                Sair
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
