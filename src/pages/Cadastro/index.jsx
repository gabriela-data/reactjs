import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

function avaliarForcaSenha(senha) {
  if (!senha) {
    return {
      texto: 'Digite uma senha',
      percentual: 0,
      cor: 'bg-gray-300',
    };
  }

  const pontos = [
    senha.length >= 8,
    senha.length >= 12,
    /[a-z]/.test(senha) && /[A-Z]/.test(senha),
    /\d/.test(senha),
    /[^A-Za-z0-9]/.test(senha),
  ].filter(Boolean).length;

  if (pontos <= 2) {
    return {
      texto: 'Fraca',
      percentual: 33,
      cor: 'bg-red-500',
    };
  }

  if (pontos <= 4) {
    return {
      texto: 'Média',
      percentual: 66,
      cor: 'bg-yellow-500',
    };
  }

  return {
    texto: 'Forte',
    percentual: 100,
    cor: 'bg-green-500',
  };
}

export default function Cadastro() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
  });

  const senha = watch('senha', '');
  const forcaSenha = avaliarForcaSenha(senha);

  const onSubmit = async (dados) => {
    try {
      await api.post('/users', {
        name: dados.nome.trim(),
        email: dados.email.trim(),
        password: dados.senha,
      });

      toast.success('Cadastro realizado com sucesso!');

      navigate('/login');
    } catch (error) {
      const status = error.response?.status;
      const mensagemErro = error.response?.data?.message;

      if (status === 409) {
        toast.error('Este e-mail já está cadastrado.');
      } else if (Array.isArray(mensagemErro)) {
        toast.error(mensagemErro.join(' '));
      } else if (typeof mensagemErro === 'string') {
        toast.error(mensagemErro);
      } else if (!error.response) {
        toast.error('Não foi possível conectar ao servidor.');
      } else {
        toast.error('Não foi possível realizar o cadastro.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-primary text-center">
          Criar conta - CuidarVet 🐾
        </h1>

        <div>
          <input
            placeholder="Nome completo"
            {...register('nome', {
              required: 'Informe seu nome.',
              validate: (valor) =>
                valor.trim().length >= 2 ||
                'Informe pelo menos 2 caracteres.',
            })}
            className="w-full border p-2 rounded"
          />

          {errors.nome && (
            <span className="text-danger text-sm">
              {errors.nome.message}
            </span>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="E-mail"
            {...register('email', {
              required: 'Informe seu e-mail.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Informe um e-mail válido.',
              },
            })}
            className="w-full border p-2 rounded"
          />

          {errors.email && (
            <span className="text-danger text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Senha"
            {...register('senha', {
              required: 'Informe uma senha.',
              minLength: {
                value: 8,
                message: 'A senha deve ter pelo menos 8 caracteres.',
              },
              deps: 'confirmacaoSenha',
            })}
            className="w-full border p-2 rounded"
          />

          {errors.senha && (
            <span className="text-danger text-sm">
              {errors.senha.message}
            </span>
          )}

          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className={`h-full ${forcaSenha.cor} transition-all`}
                style={{ width: `${forcaSenha.percentual}%` }}
              />
            </div>

            <p className="text-sm mt-1">
              Força da senha: {forcaSenha.texto}
            </p>
          </div>
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirme sua senha"
            {...register('confirmacaoSenha', {
              required: 'Confirme sua senha.',
              validate: (valor) =>
                valor === senha || 'As senhas não coincidem.',
            })}
            className="w-full border p-2 rounded"
          />

          {errors.confirmacaoSenha && (
            <span className="text-danger text-sm">
              {errors.confirmacaoSenha.message}
            </span>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register('termos', {
                required: 'É necessário aceitar os termos.',
              })}
            />

            Li e aceito os termos de uso e a política de privacidade.
          </label>

          {errors.termos && (
            <span className="text-danger text-sm">
              {errors.termos.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}