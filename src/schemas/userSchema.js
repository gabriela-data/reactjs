import { z } from 'zod';

const userSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o nome'),
  email: z.string().trim().email('Informe um e-mail válido'),
  telefone: z.string().trim().optional(),
  tipo: z.string().trim().optional(),
});

export default userSchema;
