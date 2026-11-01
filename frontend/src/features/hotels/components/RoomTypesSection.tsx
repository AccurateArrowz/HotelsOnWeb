import React from 'react';
import { RoomType } from '@hotelsonweb/shared';
import { RoomTypesTable } from './RoomTypesTable';

interface RoomTypesSectionProps {
  rooms: RoomType[];
  checkIn: Date | null;
  checkOut: Date | null;
  selectedRoomType: RoomType | null;
  roomCounts: Record<string | number, number>;
  handleSelectRoom: (roomType: RoomType) => void;
  handleRoomCountChange: (roomTypeId: string | number, value: string) => void;
  handleRoomDropdownAttempt: (event: React.MouseEvent<HTMLSelectElement>) => void;
  errorRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLDivElement>;
  availabilityLoading: boolean;
  datesNotSelectedError: string;
  roomsNotSelectedError: string;
}

export const RoomTypesSection: React.FC<RoomTypesSectionProps> = ({
  rooms,
  checkIn,
  checkOut,
  selectedRoomType,
  roomCounts,
  handleSelectRoom,
  handleRoomCountChange,
  handleRoomDropdownAttempt,
  errorRef,
  tableRef,
  availabilityLoading,
  datesNotSelectedError,
  roomsNotSelectedError,
}) => {
  return (
    <div className="rooms-section" ref={tableRef}>
      <h2>Available Rooms</h2>

      {(datesNotSelectedError || roomsNotSelectedError) && (
        <div className="dates-required-msg" ref={errorRef}>
          {datesNotSelectedError || roomsNotSelectedError}
        </div>
      )}

      {availabilityLoading && (
        <div className="availability-loading">Checking availability…</div>
      )}

      {rooms.length === 0 ? (
        <div className="no-rooms">No room types found for this hotel.</div>
      ) : (
        <RoomTypesTable
          rooms={rooms}
          checkIn={checkIn}
          checkOut={checkOut}
          selectedRoomType={selectedRoomType}
          roomCounts={roomCounts}
          handleSelectRoom={handleSelectRoom}
          handleRoomCountChange={handleRoomCountChange}
          handleRoomDropdownAttempt={handleRoomDropdownAttempt}
        />
      )}
    </div>
  );
};
