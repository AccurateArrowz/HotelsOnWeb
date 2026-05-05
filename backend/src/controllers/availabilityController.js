const availabilityService = require('../services/availabilityService');
const { sendSuccess, sendBadRequest, sendInternalError } = require('../utils/apiResponse');
const { parseLocalDate } = require('@hotelsonweb/shared');

const availabilityController = {
  /**
   * GET /hotels/:hotelId/availability
   * Query params: checkInDate, checkOutDate
   * Returns availability for all room types at the hotel
   */
  getHotelAvailability: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const { checkInDate, checkOutDate } = req.query;

      // Validate required parameters
      if (!checkInDate || !checkOutDate) {
        return sendBadRequest(res, 'checkInDate and checkOutDate are required');
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(checkInDate) || !dateRegex.test(checkOutDate)) {
        return sendBadRequest(res, 'Dates must be in YYYY-MM-DD format');
      }

      // Validate dates are not in the past - parse as local date to avoid UTC shift
      const checkIn = parseLocalDate(checkInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        return sendBadRequest(res, 'Check-in date cannot be in the past');
      }

      const availability = await availabilityService.getAvailability(
        parseInt(hotelId, 10),
        checkInDate,
        checkOutDate
      );

      return sendSuccess(res, {
        data: {
          hotelId: parseInt(hotelId, 10),
          checkInDate,
          checkOutDate,
          roomTypes: availability,
        },
      });
    } catch (error) {
      console.error('Error fetching availability:', error);
      return sendInternalError(res, 'Failed to fetch availability');
    }
  },

  /**
   * GET /hotels/:hotelId/availability/:roomTypeId
   * Query params: checkInDate, checkOutDate
   * Returns availability for a specific room type
   */
  getRoomTypeAvailability: async (req, res) => {
    try {
      const { hotelId, roomTypeId } = req.params;
      const { checkInDate, checkOutDate } = req.query;

      if (!checkInDate || !checkOutDate) {
        return sendBadRequest(res, 'checkInDate and checkOutDate are required');
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(checkInDate) || !dateRegex.test(checkOutDate)) {
        return sendBadRequest(res, 'Dates must be in YYYY-MM-DD format');
      }

      // Parse as local date to avoid UTC shift
      const parseLocalDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      };
      const checkIn = parseLocalDate(checkInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        return sendBadRequest(res, 'Check-in date cannot be in the past');
      }

      const availability = await availabilityService.checkRoomTypeAvailability(
        parseInt(hotelId, 10),
        parseInt(roomTypeId, 10),
        checkInDate,
        checkOutDate
      );

      return sendSuccess(res, { data: availability });
    } catch (error) {
      console.error('Error checking room type availability:', error);
      return sendInternalError(res, 'Failed to check availability');
    }
  },
};

module.exports = availabilityController;
