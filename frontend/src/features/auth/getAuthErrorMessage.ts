import { getApiErrorMessage, SERVER_UNAVAILABLE_MESSAGE } from '@shared/utils/getApiErrorMessage';

// Re-export for backward compatibility with existing auth imports
export { getApiErrorMessage, SERVER_UNAVAILABLE_MESSAGE };
export const getAuthErrorMessage = getApiErrorMessage;
