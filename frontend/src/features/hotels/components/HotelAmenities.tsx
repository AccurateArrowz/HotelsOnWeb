import React from 'react';
import { Bed, Waves, Users, Car, CigaretteOff, UtensilsCrossed, Bell, Wine, Coffee, ArrowUpDown, Dumbbell, Sparkles, Wifi } from 'lucide-react';

const amenityIcons: Record<string, React.ReactNode> = {
  'Outdoor swimming pool': <Waves size={18} />,
  'Family rooms': <Users size={18} />,
  'Free parking': <Car size={18} />,
  'Non-smoking rooms': <CigaretteOff size={18} />,
  'Restaurant': <UtensilsCrossed size={18} />,
  'Room service': <Bell size={18} />,
  'Bar': <Wine size={18} />,
  'Breakfast': <Coffee size={18} />,
  'Elevator': <ArrowUpDown size={18} />,
  'Fitness center': <Dumbbell size={18} />,
  'Spa and wellness center': <Sparkles size={18} />,
  'Wifi': <Wifi size={18} />,
};

interface HotelAmenitiesProps {
  amenities: string[];
}

export const HotelAmenities: React.FC<HotelAmenitiesProps> = ({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="amenities-section">
      <h2>Amenities</h2>
      <div className="amenities-grid">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <span className="amenity-icon">
              {amenityIcons[amenity] || <Bed size={18} />}
            </span>
            <span className="amenity-name">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
