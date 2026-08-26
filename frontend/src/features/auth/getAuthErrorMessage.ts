interface AuthError {
  status?: string;
  error?: string;
  message?: string;
  data?: {
    message?: string;
  };
}

const SERVER_UNAVAILABLE_MESSAGE =
  'Unable to connect to the server. Please try again in a while.';

const isServerUnavailableError = (error: AuthError): boolean => {
  const status = error?.status;
  const combinedMessage = [error?.error, error?.message]
    .filter((value) => typeof value === 'string')
    .join(' ')
    .toLowerCase();

  return (
    status === 'FETCH_ERROR' ||
    combinedMessage.includes('failed to fetch') ||
    combinedMessage.includes('networkerror') ||
    combinedMessage.includes('network error')
  );
};

export const getAuthErrorMessage = (error: AuthError, fallbackMessage: string): string => {
  if (error?.data?.message) {
    return error.data.message;
  }

  if (isServerUnavailableError(error)) {
    return SERVER_UNAVAILABLE_MESSAGE;
  }

  if (typeof error?.message === 'string' && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};
