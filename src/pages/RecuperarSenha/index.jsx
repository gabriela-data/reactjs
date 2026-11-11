import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { requestPasswordReset } from '../../services/auth';
import { getApiErrorMessage } from '../../services/errors';
import { notify } from '../../services/notification';

const schema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
});

export default function RecuperarSenha() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }) => {
    try {
      await requestPasswordReset(email);
      notify.success(
        'Se o e-mail estiver cadastrado, você receberá as instruções.'
      );
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, 'Não foi possível solicitar a recuperação.')
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-md"
      >
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Recuperar senha</h1>
          <p className="text-sm text-gray-600">
            Informe o e-mail associado à sua conta.
          </p>
        </header>
        <Input
          id="email"
          label="E-mail"
          type="email"
          icon={Mail}
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Enviar instruções
        </Button>
        {isSubmitSuccessful && (
          <p role="status" className="text-sm text-green-700">
            Solicitação enviada. Verifique sua caixa de entrada.
          </p>
        )}
        <p className="text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Voltar para o login
          </Link>
        </p>
      </form>
    </main>
  );
}
