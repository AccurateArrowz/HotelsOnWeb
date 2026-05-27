'use strict';

const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

/** Maximum number of room instances returned per room type. */
const MAX_ROOMS_PER_TYPE = 5;

/**
 * Returns available rooms grouped by room type for a hotel and stay window.
 *
 * Strategy – single round-trip to the database:
 *  1. JOIN RoomTypes → Rooms (active, status = 'available').
 *  2. Exclude any room that has a BookingRoom tied to a Booking whose
 *     date range overlaps [checkInDate, checkOutDate) and whose status is
 *     'confirmed' or 'pending'.
 *  3. A lightweight JS loop groups the flat rows into room-type buckets.
 *  4. availableRooms per type is capped at MAX_ROOMS_PER_TYPE using Math.min.
 *
 * Overlap condition (standard half-open interval):
 *   booking.checkInDate  < requestedCheckOut
 *   booking.checkOutDate > requestedCheckIn
 *
 * @param {number} hotelId
 * @param {string} checkInDate  – YYYY-MM-DD
 * @param {string} checkOutDate – YYYY-MM-DD
 * @returns {Promise<RoomTypeAvailability[]>}
 */
const getAvailability = async (hotelId, checkInDate, checkOutDate) => {
  const rows = await sequelize.query(
    `
    WITH available_rooms AS (
      SELECT
        rt.id                AS "roomTypeId",
        rt.name              AS "roomTypeName",
        rt.description       AS "description",
        rt."basePrice"       AS "basePrice",
        rt.adults            AS "maxAdults",
        rt.children          AS "maxChildren",
        r.id                 AS "roomDbId",
        r."roomId"           AS "roomId",
        r."roomNumber"       AS "roomNumber",
        r.floor              AS "floor",
        r.adults             AS "adults",
        r.children           AS "children"
      FROM  "RoomTypes" rt
      JOIN  "Rooms"     r  ON  r."roomTypeId" = rt.id
      WHERE rt."hotelId"   = :hotelId
        AND rt."isActive"  = true
        AND r."isActive"   = true
        AND r.status       = 'available'
        -- Exclude rooms that are already booked for the requested window
        AND r.id NOT IN (
          SELECT  br."roomId"
          FROM    "BookingRooms" br
          JOIN    "Bookings"     b  ON  b.id = br."bookingId"
          WHERE   b."hotelId"       = :hotelId
            AND   b.status         IN ('confirmed', 'pending')
            AND   b."checkInDate"  <  :checkOutDate
            AND   b."checkOutDate" >  :checkInDate
            AND   br."roomId"     IS NOT NULL
        )
    )
    SELECT *
    FROM   available_rooms
    ORDER  BY "roomTypeId", "roomDbId"
    `,
    {
      replacements: {
        hotelId,
        checkInDate,
        checkOutDate,
      },
      type: QueryTypes.SELECT,
    }
  );

  // Group flat rows into room-type buckets
  const roomTypeMap = new Map();

  for (const row of rows) {
    if (!roomTypeMap.has(row.roomTypeId)) {
      roomTypeMap.set(row.roomTypeId, {
        roomTypeId:     row.roomTypeId,
        roomTypeName:   row.roomTypeName,
        description:    row.description,
        basePrice:      parseFloat(row.basePrice),
        maxAdults:      row.maxAdults,
        maxChildren:    row.maxChildren,
        availableRooms: [],
      });
    }

    const roomType = roomTypeMap.get(row.roomTypeId);
    roomType.availableRooms.push({
      id:         row.roomDbId,
      roomId:     row.roomId,
      roomNumber: row.roomNumber,
      floor:      row.floor,
      adults:     row.adults,
      children:   row.children,
    });
  }

  // Cap availableRooms at MAX_ROOMS_PER_TYPE and compute totalAvailable
  return Array.from(roomTypeMap.values()).map((roomType) => ({
    ...roomType,
    availableRooms: roomType.availableRooms.slice(0, MAX_ROOMS_PER_TYPE),
    totalAvailable: Math.min(roomType.availableRooms.length, MAX_ROOMS_PER_TYPE),
  }));
};

module.exports = { getAvailability };
