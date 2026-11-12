import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/auth';

export default function Forbidden() {
  const { isAdmin } = useAuth();
  const homePath = isAdmin ? '/dashboard' : '/perfil';

  return (
    <section className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 py-12 text-center">
      <span className="mb-5 rounded-full bg-danger/10 p-4 text-danger">
        <ShieldAlert aria-hidden="true" className="size-10" />
      </span>
      <h1 className="text-3xl font-bold text-gray-900">Acesso negado</h1>
      <p className="mt-3 text-gray-600">
        Somente administradores podem acessar esta área. Se você acredita que
        isso é um engano, entre em contato com a equipe responsável.
      </p>
      <Link
        to={homePath}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Voltar para o início
      </Link>
    </section>
  );
}
