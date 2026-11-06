import React from 'react';
import { RoomType, SelectedRoomTypes } from '@hotelsonweb/shared';
import RoomTypeRow from './RoomTypeRow';



interface RoomTypesTableProps {
  roomTypes: RoomType[];
  showDatesNotSelectedWarning: (event: React.MouseEvent<HTMLSelectElement>) => void;
}

export const RoomTypesTable: React.FC<RoomTypesTableProps> = ({
  roomTypes,
  showDatesNotSelectedWarning
}) => (
  <div className="roomTypes-table-wrapper">
    <table className="roomTypes-table">
      <thead>
        <tr>
          <th>Room Type</th>
          <th>Price</th>
          <th>Rooms</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {roomTypes.map((roomType) => <RoomTypeRow roomType={roomType} showDatesNotSelectedWarning={showDatesNotSelectedWarning}/>)}
      </tbody>
    </table>
  </div>
);
