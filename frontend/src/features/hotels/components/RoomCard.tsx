interface RoomType {
  id: string;
  name: string;
  basePrice: number;
}

interface RoomCardProps {
  roomType: RoomType;
  onBookNow: () => void;
}

const RoomCard = ({ roomType, onBookNow }: RoomCardProps) => {
  return (
    <div className="room-card">
      <h3>{roomType.name}</h3>
      <p className="price">Rs.{roomType.basePrice} / night</p>
      <button className="book-btn" onClick={onBookNow}>Book Now</button>
    </div>
  );
};

export default RoomCard;
