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
  const serverMessage =
    data?.message ?? data?.mensagem ?? data?.error ?? data?.erro;

  if (typeof serverMessage === 'string' && serverMessage.trim()) {
    return serverMessage;
  }

  if (status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (status === 403) return 'Você não tem permissão para realizar esta ação.';
  if (status === 404)
    return 'O registro ou endereço solicitado não foi encontrado.';
  if (status >= 500)
    return 'O servidor encontrou um erro. Tente novamente mais tarde.';
  return fallback;
}
