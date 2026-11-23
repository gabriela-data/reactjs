export function getApiErrorMessage(
  error,
  fallback = 'Ocorreu um erro. Tente novamente.'
) {
  if (!error?.response) {
    return error?.code === 'ECONNABORTED'
      ? 'A solicitação demorou demais. Tente novamente.'
      : 'Não foi possível conectar à API. Verifique se o backend está ativo.';
  }

  const { status, data } = error.response;
  const rawMessage =
    data?.message ?? data?.mensagem ?? data?.error ?? data?.erro;

  if (Array.isArray(rawMessage)) {
    const joined = rawMessage
      .filter((item) => typeof item === 'string' && item.trim())
      .join(' • ');
    if (joined) return joined;
  }

  if (typeof rawMessage === 'string' && rawMessage.trim()) {
    return rawMessage;
  }

  if (status === 400) return 'Verifique os dados informados.';
  if (status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (status === 403) return 'Você não tem permissão para realizar esta ação.';
  if (status === 404)
    return 'O registro ou endereço solicitado não foi encontrado.';
  if (status === 409) return 'Já existe um registro com estes dados.';
  if (status >= 500)
    return 'O servidor encontrou um erro. Tente novamente mais tarde.';
  return fallback;
}
