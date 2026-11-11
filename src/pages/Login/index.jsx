import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/auth';
import { getApiErrorMessage } from '../../services/errors';
import { notify } from '../../services/notification';
import loginSchema from '../../schemas/loginSchema';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      senha: '',
    },
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.senha);
      notify.success('Bem-vindo(a)!');
      navigate('/dashboard');
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'E-mail ou senha inválidos.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-md"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">CuidarVet</h1>
          <p className="text-sm text-gray-600">Entre na sua conta para continuar.</p>
        </div>

        <Input
          id="email"
          label="E-mail"
          type="email"
          placeholder="E-mail"
          icon={Mail}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />

        <Input
          id="senha"
          label="Senha"
          type="password"
          placeholder="Senha"
          icon={Lock}
          error={errors.senha?.message}
          autoComplete="current-password"
          {...register('senha')}
        />

        <Button
          type="submit"
          loading={formState.isSubmitting}
          className="w-full"
        >
          Entrar
        </Button>
        <nav className="flex flex-col gap-2 text-center text-sm">
          <a href="/recuperar-senha" className="text-primary hover:underline">
            Esqueci minha senha
          </a>
          <p className="text-gray-600">
            Ainda não tem conta?{' '}
            <a href="/cadastro" className="font-medium text-primary hover:underline">
              Cadastre-se
            </a>
          </p>
        </nav>
      </form>
    </div>
  );
}
