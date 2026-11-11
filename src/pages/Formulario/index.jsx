import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import useUser from '../../hooks/useUser';
import userSchema from '../../schemas/userSchema';
import { usersService } from '../../services/users';
import { getApiErrorMessage } from '../../services/errors';
import { notify } from '../../services/notification';

const emptyValues = { nome: '', email: '', telefone: '', tipo: '' };

export default function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading, error } = useUser(id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome ?? user.name ?? '',
        email: user.email ?? '',
        telefone: user.telefone ?? user.phone ?? '',
        tipo: user.tipo ?? user.role ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      if (id) await usersService.update(id, values);
      else await usersService.create(values);
      notify.success(id ? 'Usuário atualizado.' : 'Usuário cadastrado.');
      navigate('/usuarios', { replace: true });
    } catch (requestError) {
      notify.error(
        getApiErrorMessage(requestError, 'Não foi possível salvar o usuário.')
      );
    }
  };

  if (loading) {
    return (
      <p role="status" className="py-12 text-center text-gray-600">
        Carregando usuário...
      </p>
    );
  }
  if (error) {
    return (
      <Card title="Não foi possível carregar o usuário">
        <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
        <Link
          to="/usuarios"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Voltar à listagem
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Editar usuário' : 'Novo usuário'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Preencha as informações do cadastro.
        </p>
      </header>
      <Card>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <Input
            id="nome"
            label="Nome"
            autoComplete="name"
            error={errors.nome?.message}
            {...register('nome')}
          />
          <Input
            id="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="telefone"
            label="Telefone"
            type="tel"
            autoComplete="tel"
            error={errors.telefone?.message}
            {...register('telefone')}
          />
          <Input
            id="tipo"
            label="Perfil / função"
            error={errors.tipo?.message}
            {...register('tipo')}
          />
          <div className="flex flex-wrap justify-end gap-3">
            <Link
              to="/usuarios"
              className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <Button type="submit" loading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
