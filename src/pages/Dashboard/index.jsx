import { ArrowRight, Settings, UserRound, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/auth';

const shortcuts = [
  {
    to: '/usuarios',
    title: 'Usuários',
    text: 'Consulte e gerencie os usuários cadastrados.',
    icon: UsersRound,
  },
  {
    to: '/perfil',
    title: 'Meu perfil',
    text: 'Revise suas informações pessoais.',
    icon: UserRound,
  },
  {
    to: '/configuracoes',
    title: 'Configurações',
    text: 'Ajuste suas preferências locais.',
    icon: Settings,
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.nome ?? user?.name ?? 'equipe CuidarVet';

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-medium text-primary">Visão geral</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          Olá, {name}
        </h1>
        <p className="mt-2 text-gray-600">
          Bem-vindo ao painel de gestão da clínica.
        </p>
      </header>
      <section
        aria-label="Atalhos"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {shortcuts.map(({ to, title, text, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Card className="h-full transition group-hover:border-primary/40 group-hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 text-gray-400 group-hover:text-primary"
                />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                {title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">{text}</p>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
