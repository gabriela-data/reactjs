import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/auth';
import useUser from '../../hooks/useUser';
import { createUserSchema, updateUserSchema } from '../../schemas/userSchema';
import { usersService } from '../../services/users';
import { getApiErrorMessage } from '../../services/errors';
import { notify } from '../../services/notification';

const emptyValues = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
};

export default function Formulario() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user: sessionUser, updateUser: updateSessionUser } = useAuth();
  const { user, loading, error } = useUser(id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isEditing && user) {
      reset({
        nome: user.nome ?? user.name ?? '',
        email: user.email ?? '',
      });
    } else if (!isEditing) {
      reset(emptyValues);
    }
  }, [isEditing, user, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        const savedUser = await usersService.update(id, {
          nome: values.nome,
          email: values.email,
        });
        if (sessionUser?.id === id) {
          updateSessionUser(savedUser);
        }
        notify.success('Usuário atualizado.');
      } else {
        await usersService.create({
          nome: values.nome,
          email: values.email,
          senha: values.senha,
        });
        notify.success('Usuário cadastrado.');
      }
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

  const roleLabel = user?.role === 'admin' ? 'Administrador' : 'Usuário';

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar usuário' : 'Novo usuário'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {isEditing
            ? 'Atualize as informações do cadastro.'
            : 'Preencha os dados para cadastrar um novo usuário.'}
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
          {isEditing ? (
            <Input
              id="role"
              label="Perfil / função"
              value={roleLabel}
              disabled
              readOnly
            />
          ) : (
            <>
              <Input
                id="senha"
                label="Senha"
                type="password"
                autoComplete="new-password"
                error={errors.senha?.message}
                {...register('senha')}
              />
              <Input
                id="confirmarSenha"
                label="Confirmar senha"
                type="password"
                autoComplete="new-password"
                error={errors.confirmarSenha?.message}
                {...register('confirmarSenha')}
              />
            </>
          )}
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
