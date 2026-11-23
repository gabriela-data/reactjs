import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { requestPasswordReset, resetPassword } from '../../services/auth';
import { getApiErrorMessage } from '../../services/errors';
import { notify } from '../../services/notification';

const requestSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
});

const resetSchema = z
  .object({
    token: z.string().trim().min(1, 'Informe o código recebido por e-mail'),
    senha: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme sua nova senha'),
  })
  .refine((values) => values.senha === values.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
  });

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [step, setStep] = useState('request');
  const [sentEmail, setSentEmail] = useState('');

  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { token: '', senha: '', confirmarSenha: '' },
  });

  const handleRequestSubmit = async ({ email }) => {
    try {
      const response = await requestPasswordReset(email);
      setSentEmail(email);
      setStep('reset');
      notify.success(
        response?.message ??
          'Se o e-mail estiver cadastrado, você receberá o código de recuperação.'
      );
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, 'Não foi possível solicitar a recuperação.')
      );
    }
  };

  const handleResetSubmit = async ({ token, senha }) => {
    try {
      const response = await resetPassword({ token, password: senha });
      notify.success(response?.message ?? 'Senha redefinida com sucesso.');
      navigate('/login', { replace: true });
    } catch (error) {
      notify.error(
        getApiErrorMessage(
          error,
          'Não foi possível redefinir a senha. Verifique o código informado.'
        )
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      {step === 'request' ? (
        <form
          onSubmit={requestForm.handleSubmit(handleRequestSubmit)}
          noValidate
          className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-md"
        >
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-primary">Recuperar senha</h1>
            <p className="text-sm text-gray-600">
              Informe o e-mail associado à sua conta para receber o código de
              redefinição.
            </p>
          </header>
          <Input
            id="email"
            label="E-mail"
            type="email"
            icon={Mail}
            autoComplete="email"
            error={requestForm.formState.errors.email?.message}
            {...requestForm.register('email')}
          />
          <Button
            type="submit"
            loading={requestForm.formState.isSubmitting}
            className="w-full"
          >
            Enviar código
          </Button>
          <div className="space-y-2 text-center text-sm">
            <button
              type="button"
              onClick={() => setStep('reset')}
              className="font-medium text-primary hover:underline"
            >
              Já tenho o código de recuperação
            </button>
            <p>
              <Link
                to="/login"
                className="font-medium text-gray-600 hover:text-primary hover:underline"
              >
                Voltar para o login
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <form
          onSubmit={resetForm.handleSubmit(handleResetSubmit)}
          noValidate
          className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-md"
        >
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-primary">Redefinir senha</h1>
            <p className="text-sm text-gray-600">
              {sentEmail
                ? `Informe o código enviado para ${sentEmail} e defina sua nova senha.`
                : 'Informe o código recebido por e-mail e defina sua nova senha.'}
            </p>
          </header>
          <Input
            id="token"
            label="Código de recuperação"
            placeholder="Ex.: 123456"
            icon={KeyRound}
            autoComplete="one-time-code"
            error={resetForm.formState.errors.token?.message}
            {...resetForm.register('token')}
          />
          <Input
            id="senha"
            label="Nova senha"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            error={resetForm.formState.errors.senha?.message}
            {...resetForm.register('senha')}
          />
          <Input
            id="confirmarSenha"
            label="Confirmar nova senha"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            error={resetForm.formState.errors.confirmarSenha?.message}
            {...resetForm.register('confirmarSenha')}
          />
          <Button
            type="submit"
            loading={resetForm.formState.isSubmitting}
            className="w-full"
          >
            Redefinir senha
          </Button>
          <div className="space-y-2 text-center text-sm">
            <button
              type="button"
              onClick={() => setStep('request')}
              className="font-medium text-primary hover:underline"
            >
              Solicitar novo código
            </button>
            <p>
              <Link
                to="/login"
                className="font-medium text-gray-600 hover:text-primary hover:underline"
              >
                Voltar para o login
              </Link>
            </p>
          </div>
        </form>
      )}
    </main>
  );
}
