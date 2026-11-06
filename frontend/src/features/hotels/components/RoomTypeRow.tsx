import React from "react";
import { Users, Baby, Check } from "lucide-react";
import { RoomType } from "@hotelsonweb/shared";
import useRoomSelections from "../hooks/useRoomSelections";

interface Chip {
  label: string;
  color: string;
}

const getRoomChips = (roomName = ""): Chip[] => {
  const name = roomName.toLowerCase();
  const chips: Chip[] = [
    { label: "Wifi", color: "chip-blue" },
    { label: "AC", color: "chip-teal" },
  ];
  if (
    name.includes("premium") ||
    name.includes("suite") ||
    name.includes("deluxe")
  ) {
    chips.push({ label: "Breakfast", color: "chip-orange" });
    chips.push({ label: "Spa Access", color: "chip-purple" });
  }
  if (name.includes("suite") || name.includes("penthouse")) {
    chips.push({ label: "Butler Service", color: "chip-gold" });
  }
  if (name.includes("family")) {
    chips.push({ label: "Extra Beds", color: "chip-green" });
  }
  if (name.includes("business")) {
    chips.push({ label: "Work Desk", color: "chip-gray" });
  }
  return chips;
};

type RoomsSelectorProps = { 
  roomType: RoomType;
  showDatesNotSelectedWarning: ()=> void; 
}

function RoomsSelector({ roomType, showDatesNotSelectedWarning }: RoomsSelectorProps) {
  const {roomSelections, updateRoomSelections } = useRoomSelections(); //using hook to find the no of rooms currently selected
  const roomSelection = roomSelections.find(selection => selection.roomTypeId === roomType.id); 
  const count = roomSelection?.count;
  const availableRooms = roomType.availableRooms;

  if (roomType.availableRooms == null) { // availableRoomTypes would be undefined when the dates would not have been selected and thus, no reponse from availability endpoint
    return <select
            aria-label={`Rooms for room type ${roomType.name}`}
            value=""
            onClick={showDatesNotSelectedWarning}
            className='w-4'
          >
          </select>
  } 
  else if (roomType.availableRooms === 0) {
    return <span className="unavailable-label">Unavailable</span>;
  } 
  else {
    return(

      <select
      className="roomTypes-select"
      value={count}
      // onKeyDown={(event) => {
        //   if (
          //     ["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)
          //   ) {
            //    something imp
            //   }
            // }}
            onChange={(event) =>
              updateRoomSelections({roomTypeId: roomType.id, count: Number(event.target.value)})
            }
            aria-label={`Number of ${roomType.name} roomTypes`}
            >
      {Array.from(
        { length: availableRooms + 1 },
        (_, index) => index,
      ).map((no) => (
        <option key={no} value={no}>
          {no}
        </option>
      ))}
    </select>
    )
  }
}

type RoomTypeRowProps = {
  roomType: RoomType;
       showDatesNotSelectedWarning: ()=> void; 

};

export default function RoomTypeRow({ roomType, showDatesNotSelectedWarning }: RoomTypeRowProps) {
  const chips = getRoomChips(roomType.name);
  const adultCapacity = roomType.adults ?? null;
  const childrenCapacity = roomType.children ?? null;
  const unavailable = !roomType.isAvailable;


  return (
    <tr
      key={roomType.id}
      className={`room-row } ${unavailable ? "room-row--unavailable" : ""}`}
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
                {adultCapacity} Adult{adultCapacity !== 1 ? "s" : ""}
              </span>
            </span>
          )}
          {childrenCapacity != null && (
            <span className="room-capacity-item">
              <Baby size={14} />
              <span>
                {childrenCapacity} Child{childrenCapacity !== 1 ? "ren" : ""}
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
        <RoomsSelector roomType={roomType} showDatesNotSelectedWarning={showDatesNotSelectedWarning} />
      </td>
    </tr>
  );
}
