/**
 * Hotel request status constants
 */
export const HOTEL_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  UNDER_REVIEW: 'under_review',
} as const;

export type HotelRequestStatus = (typeof HOTEL_REQUEST_STATUS)[keyof typeof HOTEL_REQUEST_STATUS];
