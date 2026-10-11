import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock, Mail } from 'lucide-react'
import Input from '../../components/Input'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.senha)
      toast.success('Bem-vindo(a)!')
      navigate('/dashboard')
    } catch {
      toast.error('E-mail ou senha inválidos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-primary">CuidarVet 🐾</h1>

        <Input
          id="email"
          label="E-mail"
          type="email"
          placeholder="E-mail"
          icon={Mail}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email', { required: 'Obrigatório' })}
        />

        <Input
          id="senha"
          label="Senha"
          type="password"
          placeholder="Senha"
          icon={Lock}
          error={errors.senha?.message}
          autoComplete="current-password"
          {...register('senha', { required: 'Obrigatório' })}
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:opacity-90"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
