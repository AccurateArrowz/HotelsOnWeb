const SERVER_UNAVAILABLE_MESSAGE =
  'Unable to connect to the server. Please make sure the backend is running and try again.';

const isServerUnavailableError = (error) => {
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

export const getAuthErrorMessage = (error, fallbackMessage) => {
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
