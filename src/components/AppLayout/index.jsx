import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/usuarios': 'Usuários',
  '/usuarios/novo': 'Novo usuário',
  '/perfil': 'Meu perfil',
  '/configuracoes': 'Configurações',
};

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const title =
    pageTitles[pathname] ??
    (pathname.startsWith('/usuarios/') ? 'Editar usuário' : 'CuidarVet');

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar breadcrumbs={[{ label: 'Início', to: '/dashboard' }, { label: title }]} />
        <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
