import { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { notify } from '../../services/notification';

const STORAGE_KEY = '@vet:settings';

function readPreferences() {
  try {
    return (
      JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {
        emailNotifications: true,
      }
    );
  } catch {
    return { emailNotifications: true };
  }
}

export default function Configuracoes() {
  const [preferences, setPreferences] = useState(readPreferences);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    notify.success('Preferências salvas neste dispositivo.');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-600">
          Preferências da sua sessão.
        </p>
      </header>
      <Card title="Notificações">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={(event) =>
              setPreferences({
                ...preferences,
                emailNotifications: event.target.checked,
              })
            }
            className="mt-1 size-4 accent-primary"
          />
          <span>
            <span className="block text-sm font-medium text-gray-900">
              Receber notificações por e-mail
            </span>
            <span className="mt-1 block text-sm text-gray-600">
              Esta preferência fica salva localmente neste navegador.
            </span>
          </span>
        </label>
        <div className="mt-6 flex justify-end">
          <Button onClick={save}>Salvar preferências</Button>
        </div>
      </Card>
    </div>
  );
}
