import { z } from 'zod';

export const updateUserSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o nome'),
  email: z.string().trim().email('Informe um e-mail válido'),
});

export const createUserSchema = z
  .object({
    nome: z.string().trim().min(2, 'Informe o nome'),
    email: z.string().trim().email('Informe um e-mail válido'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme a senha'),
  })
  .refine((values) => values.senha === values.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
  });

export default updateUserSchema;
