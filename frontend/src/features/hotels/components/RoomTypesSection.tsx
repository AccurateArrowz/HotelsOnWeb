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
  datesError: string;
  roomError: string;
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
  datesError,
  roomError,
}) => {
  return (
    <div className="rooms-section" ref={tableRef}>
      <h2>Available Rooms</h2>

      {(datesError || roomError) && (
        <div className="dates-required-msg" ref={errorRef}>
          {datesError || roomError}
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
