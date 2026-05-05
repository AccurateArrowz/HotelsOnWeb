/**
 * Date utility functions for consistent date handling across the application.
 */

/**
 * Parses a YYYY-MM-DD string as a local date to avoid UTC conversion.
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Local date object
 */
export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formats a Date object to YYYY-MM-DD string.
 * @param date - Date object
 * @returns Formatted date string
 */
export const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates the number of nights between two dates.
 * Accepts either Date objects or YYYY-MM-DD strings.
 * @param checkInDate - Check-in date
 * @param checkOutDate - Check-out date
 * @returns Number of nights
 */
export const calculateNights = (
  checkInDate: Date | string,
  checkOutDate: Date | string
): number => {
  if (!checkInDate || !checkOutDate) return 0;

  const checkIn =
    typeof checkInDate === 'string' ? parseLocalDate(checkInDate) : checkInDate;
  const checkOut =
    typeof checkOutDate === 'string'
      ? parseLocalDate(checkOutDate)
      : checkOutDate;

  const diffTime = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
