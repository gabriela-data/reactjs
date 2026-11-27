import { Check, Circle } from 'lucide-react';

export default function PasswordStrength({ password = '' }) {
  const criteria = [
    {
      label: 'Pelo menos 6 caracteres',
      valid: password.length >= 6,
    },
    {
      label: 'Uma letra maiúscula',
      valid: /[A-Z]/.test(password),
    },
    {
      label: 'Um número',
      valid: /[0-9]/.test(password),
    },
    {
      label: 'Um caractere especial (!@#$...)',
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const score = criteria.filter((item) => item.valid).length;

  const levels = [
    { label: 'Muito fraca', color: 'bg-red-500', text: 'text-red-600' },
    { label: 'Fraca', color: 'bg-orange-500', text: 'text-orange-600' },
    { label: 'Média', color: 'bg-yellow-400', text: 'text-yellow-600' },
    { label: 'Forte', color: 'bg-green-500', text: 'text-green-600' },
    { label: 'Muito forte', color: 'bg-blue-600', text: 'text-blue-600' },
  ];

  const level = levels[score];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Força da senha
        </span>

        <span className={`text-sm font-semibold ${level.text}`}>
          {level.label}
        </span>
      </div>

      <div className="flex gap-1.5" aria-label={`Força da senha: ${level.label}`}>
        {levels.slice(0).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              score >= index ? level.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <ul className="space-y-1.5">
        {criteria.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 text-xs"
          >
            {item.valid ? (
              <Check className="size-4 text-green-600" />
            ) : (
              <Circle className="size-4 text-gray-400" />
            )}

            <span className={item.valid ? 'text-green-700' : 'text-gray-500'}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
