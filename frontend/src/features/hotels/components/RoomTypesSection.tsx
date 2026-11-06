import React from 'react';
import { RoomType } from '@hotelsonweb/shared';
import { RoomTypesTable } from './RoomTypesTable';

interface RoomTypesSectionProps {
  roomTypes: RoomType[];
  showDatesNotSelectedWarning: (event: React.MouseEvent<HTMLSelectElement>) => void;
  errorRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLDivElement>;
  availabilityLoading: boolean;
  datesNotSelectedError: string;
  roomsNotSelectedError: string;
}

export const RoomTypesSection: React.FC<RoomTypesSectionProps> = ({
  roomTypes,
  showDatesNotSelectedWarning,
  errorRef,
  tableRef,
  availabilityLoading,
  datesNotSelectedError,
  roomsNotSelectedError,
}) => {
  return (
    <div className="roomTypes-section" ref={tableRef}>
      <h2>Available Rooms</h2>

      {(datesNotSelectedError || roomsNotSelectedError) && (
        <div className="dates-required-msg" ref={errorRef}>
          {datesNotSelectedError || roomsNotSelectedError}
        </div>
      )}

      {availabilityLoading && (
        <div className="availability-loading">Checking availability…</div>
      )}

      {roomTypes.length === 0 ? (
        <div className="no-roomTypes">No room types found for this hotel.</div>
      ) : (
        <RoomTypesTable
          roomTypes={roomTypes}
          showDatesNotSelectedWarning={showDatesNotSelectedWarning}
        />
      )}
    </div>
  );
};
