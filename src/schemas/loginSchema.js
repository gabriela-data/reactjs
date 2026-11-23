import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um e-mail válido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export default loginSchema;
