import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { register as registerUser } from '../../services/auth';
import { getApiErrorMessage } from '../../services/errors';
import { notify } from '../../services/notification';
import registerSchema from '../../schemas/registerSchema';

export default function Cadastro() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: '', email: '', senha: '', confirmarSenha: '' },
  });

  const onSubmit = async ({ confirmarSenha, ...user }) => {
    try {
      await registerUser(user);
      notify.success('Cadastro realizado. Faça login para continuar.');
      navigate('/login', { replace: true });
    } catch (error) {
      notify.error(getApiErrorMessage(error, 'Não foi possível concluir o cadastro.'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-md space-y-5 rounded-xl bg-white p-6 shadow-md sm:p-8"
      >
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Criar conta</h1>
          <p className="text-sm text-gray-600">Cadastre-se no CuidarVet.</p>
        </header>
        <Input id="nome" label="Nome completo" icon={UserRound} autoComplete="name" error={errors.nome?.message} {...register('nome')} />
        <Input id="email" label="E-mail" type="email" icon={Mail} autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input id="senha" label="Senha" type="password" autoComplete="new-password" error={errors.senha?.message} {...register('senha')} />
        <Input id="confirmarSenha" label="Confirmar senha" type="password" autoComplete="new-password" error={errors.confirmarSenha?.message} {...register('confirmarSenha')} />
        <Button type="submit" loading={isSubmitting} className="w-full">Criar conta</Button>
        <p className="text-center text-sm text-gray-600">
          Já tem conta? <Link to="/login" className="font-medium text-primary hover:underline">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
