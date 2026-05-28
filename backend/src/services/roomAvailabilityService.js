'use strict';

const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const { parseLocalDate } = require('@hotelsonweb/shared');

const MAX_ROOMS_PER_TYPE = 5;
const BLOCKING_BOOKING_STATUSES = ['confirmed', 'pending'];

const getNightCount = (checkInDate, checkOutDate) => {
  const checkIn = parseLocalDate(checkInDate);
  const checkOut = parseLocalDate(checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    throw new Error('Check-out date must be after check-in date');
  }

  return nights;
};

const getRoomTypeRows = async (hotelId, checkInDate, checkOutDate, roomTypeId = null) => {
  return sequelize.query(
    `
    WITH room_type_capacity AS (
      SELECT
        rt.id AS "roomTypeId",
        rt.name AS "roomTypeName",
        rt.description,
        rt."basePrice",
        rt.adults AS "maxAdults",
        rt.children AS "maxChildren",
        COUNT(r.id)::int AS "totalRooms"
      FROM "RoomTypes" rt
      LEFT JOIN "Rooms" r
        ON r."roomTypeId" = rt.id
       AND r."hotelId" = rt."hotelId"
       AND r."isActive" = true
       AND r.status = 'available'
      WHERE rt."hotelId" = :hotelId
        AND rt."isActive" = true
        AND (:roomTypeId IS NULL OR rt.id = :roomTypeId)
      GROUP BY rt.id
    ),
    booked_by_type AS (
      SELECT
        br."roomTypeId",
        COUNT(br.id)::int AS "bookedRooms"
      FROM "BookingRooms" br
      INNER JOIN "Bookings" b
        ON b.id = br."bookingId"
      WHERE b."hotelId" = :hotelId
        AND b.status IN (:blockingStatuses)
        AND b."checkInDate" < :checkOutDate
        AND b."checkOutDate" > :checkInDate
        AND (:roomTypeId IS NULL OR br."roomTypeId" = :roomTypeId)
      GROUP BY br."roomTypeId"
    )
    SELECT
      rtc.*,
      COALESCE(bbt."bookedRooms", 0)::int AS "bookedRooms",
      GREATEST(rtc."totalRooms" - COALESCE(bbt."bookedRooms", 0), 0)::int AS "totalAvailable"
    FROM room_type_capacity rtc
    LEFT JOIN booked_by_type bbt
      ON bbt."roomTypeId" = rtc."roomTypeId"
    ORDER BY rtc."roomTypeId";
    `,
    {
      replacements: {
        hotelId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        blockingStatuses: BLOCKING_BOOKING_STATUSES,
      },
      type: QueryTypes.SELECT,
    }
  );
};

const getAvailableRoomRows = async (hotelId, checkInDate, checkOutDate) => {
  return sequelize.query(
    `
    SELECT
      r.id,
      r."roomId",
      r."roomTypeId",
      r."roomNumber",
      r.floor,
      r.adults,
      r.children
    FROM "Rooms" r
    WHERE r."hotelId" = :hotelId
      AND r."isActive" = true
      AND r.status = 'available'
      AND NOT EXISTS (
        SELECT 1
        FROM "BookingRooms" br
        INNER JOIN "Bookings" b
          ON b.id = br."bookingId"
        WHERE br."roomId" = r.id
          AND b."hotelId" = :hotelId
          AND b.status IN (:blockingStatuses)
          AND b."checkInDate" < :checkOutDate
          AND b."checkOutDate" > :checkInDate
      )
    ORDER BY r."roomTypeId", r.id;
    `,
    {
      replacements: {
        hotelId,
        checkInDate,
        checkOutDate,
        blockingStatuses: BLOCKING_BOOKING_STATUSES,
      },
      type: QueryTypes.SELECT,
    }
  );
};

const getAvailability = async (hotelId, checkInDate, checkOutDate) => {
  const nights = getNightCount(checkInDate, checkOutDate);
  const [roomTypes, roomRows] = await Promise.all([
    getRoomTypeRows(hotelId, checkInDate, checkOutDate),
    getAvailableRoomRows(hotelId, checkInDate, checkOutDate),
  ]);

  const roomsByType = roomRows.reduce((groups, room) => {
    const roomTypeRooms = groups.get(room.roomTypeId) || [];
    roomTypeRooms.push({
      id: room.id,
      roomId: room.roomId,
      roomNumber: room.roomNumber,
      floor: room.floor,
      adults: room.adults,
      children: room.children,
    });
    groups.set(room.roomTypeId, roomTypeRooms);
    return groups;
  }, new Map());

  return roomTypes.map((roomType) => {
    const availableRooms = roomsByType
      .get(roomType.roomTypeId)
      ?.slice(0, Math.min(roomType.totalAvailable, MAX_ROOMS_PER_TYPE)) || [];
    const basePrice = parseFloat(roomType.basePrice);
    const totalPrice = basePrice * nights;

    return {
      roomTypeId: roomType.roomTypeId,
      roomTypeName: roomType.roomTypeName,
      description: roomType.description,
      basePrice,
      maxAdults: roomType.maxAdults,
      maxChildren: roomType.maxChildren,
      totalRooms: roomType.totalRooms,
      bookedRooms: roomType.bookedRooms,
      totalAvailable: Math.min(roomType.totalAvailable, MAX_ROOMS_PER_TYPE),
      availableRooms,
      nights,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      isAvailable: roomType.totalAvailable > 0,
    };
  });
};

const checkRoomTypeAvailability = async (hotelId, roomTypeId, checkInDate, checkOutDate) => {
  getNightCount(checkInDate, checkOutDate);

  const [roomTypeAvailability] = await getRoomTypeRows(
    hotelId,
    checkInDate,
    checkOutDate,
    roomTypeId
  );

  const totalAvailable = roomTypeAvailability?.totalAvailable || 0;

  return {
    available: totalAvailable > 0,
    totalAvailable,
  };
};

module.exports = {
  getAvailability,
  checkRoomTypeAvailability,
};
