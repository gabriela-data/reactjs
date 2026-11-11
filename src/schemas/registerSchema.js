import { z } from 'zod';

const registerSchema = z
  .object({
    nome: z.string().trim().min(2, 'Informe seu nome completo'),
    email: z.string().trim().email('Informe um e-mail válido'),
    senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((values) => values.senha === values.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
  });

export default registerSchema;
