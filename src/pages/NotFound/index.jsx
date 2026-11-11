import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <section className="max-w-md space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Erro 404
        </p>
        <h1 className="text-3xl font-bold text-gray-900">
          Página não encontrada
        </h1>
        <p className="text-gray-600">
          O endereço informado não existe ou foi removido.
        </p>
        <Link
          to="/login"
          className="inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Voltar para o login
        </Link>
      </section>
    </main>
  );
}
