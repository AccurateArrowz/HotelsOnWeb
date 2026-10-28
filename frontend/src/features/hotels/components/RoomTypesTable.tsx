import React from 'react';
import { RoomType, SelectedRoomTypes } from '@hotelsonweb/shared';
import { Users, Baby, Check } from 'lucide-react';

interface Chip {
  label: string;
  color: string;
}

const getRoomChips = (roomName = ''): Chip[] => {
  const name = roomName.toLowerCase();
  const chips: Chip[] = [
    { label: 'Wifi', color: 'chip-blue' },
    { label: 'AC', color: 'chip-teal' },
  ];
  if (name.includes('premium') || name.includes('suite') || name.includes('deluxe')) {
    chips.push({ label: 'Breakfast', color: 'chip-orange' });
    chips.push({ label: 'Spa Access', color: 'chip-purple' });
  }
  if (name.includes('suite') || name.includes('penthouse')) {
    chips.push({ label: 'Butler Service', color: 'chip-gold' });
  }
  if (name.includes('family')) {
    chips.push({ label: 'Extra Beds', color: 'chip-green' });
  }
  if (name.includes('business')) {
    chips.push({ label: 'Work Desk', color: 'chip-gray' });
  }
  return chips;
};

interface RoomTypesTableProps {
  rooms: RoomType[];
  checkIn: Date | null;
  checkOut: Date | null;
  selectedRoomTypes: SelectedRoomTypes;
  roomCounts: Record<string | number, number>;
  handleSelectRoom: (roomType: RoomType) => void;
  handleRoomCountChange: (roomTypeId: string | number, value: string) => void;
  handleRoomDropdownAttempt: (event: React.MouseEvent<HTMLSelectElement>) => void;
}

export const RoomTypesTable: React.FC<RoomTypesTableProps> = ({
  rooms,
  checkIn,
  checkOut,
  selectedRoomTypes,
  roomCounts,
  handleSelectRoom,
  handleRoomCountChange,
  handleRoomDropdownAttempt,
}) => (
  <div className="rooms-table-wrapper">
    <table className="rooms-table">
      <thead>
        <tr>
          <th>Room Type</th>
          <th>Price</th>
          <th>Rooms</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((roomType) => {
          const chips = getRoomChips(roomType.name);
          const adultCapacity = roomType.adults ?? roomType.maxAdults ?? null;
          const childrenCapacity = roomType.children ?? roomType.maxChildren ?? null;
          const count = roomCounts[roomType.id] ?? '';
          // const isSelected = selectedRoomType?.id === roomType.id;
          const isSelected = false;
          // const maxRooms =
          //   checkIn && checkOut && roomType.availableRooms != null
          //     ? Math.max(1, roomType.availableRooms)
          //     : 5;
          const unavailable = checkIn && checkOut && !roomType.isAvailable;

          return (
            <tr
              key={roomType.id}
              className={`room-row ${isSelected ? 'room-row--selected' : ''} ${
                unavailable ? 'room-row--unavailable' : ''
              }`}
            >
              <td className="room-name-cell">
                <div className="room-name">{roomType.name}</div>
                <div className="room-chips">
                  {chips.map((chip) => (
                    <span key={chip.label} className={`room-type-chip ${chip.color}`}>
                      {chip.label}
                    </span>
                  ))}
                </div>
                <div className="room-capacity">
                  {adultCapacity != null && (
                    <span className="room-capacity-item">
                      <Users size={14} />
                      <span>
                        {adultCapacity} Adult{adultCapacity !== 1 ? 's' : ''}
                      </span>
                    </span>
                  )}
                  {childrenCapacity != null && (
                    <span className="room-capacity-item">
                      <Baby size={14} />
                      <span>
                        {childrenCapacity} Child{childrenCapacity !== 1 ? 'ren' : ''}
                      </span>
                    </span>
                  )}
                </div>
              </td>

              <td className="room-price-cell">
                <span className="room-price">Rs.{roomType.basePrice}</span>
                <span className="room-price-unit"> / night</span>
              </td>

              <td className="room-count-cell">
                {unavailable ? (
                  <span className="unavailable-label">Unavailable</span>
                ) : (
                  <select
                    className="rooms-select"
                    value={count}
                    onMouseDown={handleRoomDropdownAttempt as any}
                    onKeyDown={(event) => {
                      if (
                        (!checkIn || !checkOut) &&
                        ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)
                      ) {
                        handleRoomDropdownAttempt(event as any);
                      }
                    }}
                    onChange={(event) => handleRoomCountChange(roomType.id, event.target.value)}
                    aria-label={`Number of ${roomType.name} rooms`}
                  >
                    {!checkIn || !checkOut ? <option value="" disabled hidden /> : null}
                    {Array.from({ length: roomType.availableRooms + 1 },
                        (_, index) => index ).map((quantity) => (
                      <option key={quantity} value={quantity}>
                        {quantity}
                      </option>
                    ))}
                  </select>
                )}
              </td>

              <td className="room-action-cell">
                <button
                  className={`select-room-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectRoom(roomType)}
                  disabled={!!unavailable}
                >
                  {isSelected ? (
                    <>
                      <Check size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      Selected
                    </>
                  ) : (
                    'Select'
                  )}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
