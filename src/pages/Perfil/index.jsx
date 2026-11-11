import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/auth';
import useUser from '../../hooks/useUser';
import userSchema from '../../schemas/userSchema';
import { usersService } from '../../services/users';
import { getApiErrorMessage } from '../../services/errors';
import { notify } from '../../services/notification';

export default function Perfil() {
  const { user: sessionUser, updateUser } = useAuth();
  const id = sessionUser?.id ?? sessionUser?._id;
  const { user: fetchedUser, loading, error } = useUser(id);
  const currentUser = fetchedUser ?? sessionUser;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(userSchema) });

  useEffect(() => {
    if (currentUser) {
      reset({
        nome: currentUser.nome ?? currentUser.name ?? '',
        email: currentUser.email ?? '',
        telefone: currentUser.telefone ?? currentUser.phone ?? '',
        tipo: currentUser.tipo ?? currentUser.role ?? '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (values) => {
    if (!id) {
      notify.error(
        'A API não informou o identificador do usuário autenticado.'
      );
      return;
    }
    try {
      const savedUser = await usersService.update(id, values);
      updateUser(savedUser);
      notify.success('Perfil atualizado.');
    } catch (requestError) {
      notify.error(
        getApiErrorMessage(requestError, 'Não foi possível atualizar o perfil.')
      );
    }
  };

  if (loading)
    return (
      <p role="status" className="py-12 text-center">
        Carregando perfil...
      </p>
    );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Meu perfil</h1>
        <p className="mt-1 text-sm text-gray-600">
          Atualize seus dados pessoais.
        </p>
      </header>
      <Card>
        {error && (
          <p role="alert" className="mb-4 text-sm text-danger">
            {getApiErrorMessage(error)}
          </p>
        )}
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
            disabled
            error={errors.tipo?.message}
            {...register('tipo')}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Salvar alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
