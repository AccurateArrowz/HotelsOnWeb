import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import type { OwnerHotel } from '@features/owner/ownerHotelsApi';
import './HotelSwitcher.css';

interface HotelSwitcherProps {
  hotels: OwnerHotel[];
  activeHotel: OwnerHotel | null;
  onHotelChange: (hotel: OwnerHotel) => void;
  isLoading?: boolean;
}

export const HotelSwitcher = ({
  hotels,
  activeHotel,
  onHotelChange,
  isLoading = false,
}: HotelSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (hotel: OwnerHotel) => {
      if (hotel.id !== activeHotel?.id) {
        onHotelChange(hotel);
      }
      setIsOpen(false);
      buttonRef.current?.focus();
    },
    [activeHotel, onHotelChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          if (!isOpen) {
            setIsOpen(true);
          }
          break;
      }
    },
    [isOpen]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const activeItem = menuRef.current.querySelector('[data-active="true"]') as HTMLElement;
      activeItem?.focus();
    }
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className="hotel-switcher hotel-switcher--loading">
        <div className="hotel-switcher__skeleton">
          <div className="skeleton-avatar" />
          <div className="skeleton-text" />
        </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="hotel-switcher hotel-switcher--empty">
        <span className="hotel-switcher__empty-text">No hotels</span>
      </div>
    );
  }

  const currentHotel = activeHotel ?? hotels[0];
  const otherHotels = hotels.filter((h) => h.id !== currentHotel.id);

  return (
    <div ref={containerRef} className="hotel-switcher">
      <button
        ref={buttonRef}
        type="button"
        className={`hotel-switcher__trigger ${isOpen ? 'is-open' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={otherHotels.length > 0 ? `Current hotel: ${currentHotel.name}. Press to switch hotels` : `Current hotel: ${currentHotel.name}. Press to add a property`}
      >
        <div className="hotel-switcher__avatar">
          {currentHotel.name.charAt(0).toUpperCase()}
        </div>
        <div className="hotel-switcher__info">
          <span className="hotel-switcher__name">{currentHotel.name}</span>
          <span className="hotel-switcher__label">Owner Portal</span>
        </div>
        <ChevronDown
          size={16}
          className={`hotel-switcher__chevron ${isOpen ? 'is-open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="hotel-switcher__dropdown"
          role="listbox"
          aria-label="Select a hotel"
        >
          {otherHotels.length > 0 && (
            <div className="hotel-switcher__section">
              <span className="hotel-switcher__section-title">Your Hotels</span>
            </div>
          )}

          <div className="hotel-switcher__list">
            {otherHotels.map((hotel) => (
              <button
                key={hotel.id}
                type="button"
                className="hotel-switcher__item"
                onClick={() => handleSelect(hotel)}
                role="option"
                aria-selected={false}
                tabIndex={-1}
              >
                <div
                  className="hotel-switcher__item-avatar"
                  style={{ backgroundColor: getHotelColor(hotel.name) }}
                >
                  {hotel.name.charAt(0).toUpperCase()}
                </div>
                <div className="hotel-switcher__item-info">
                  <span className="hotel-switcher__item-name">{hotel.name}</span>
                  <span className="hotel-switcher__item-location">
                    {hotel.city}, {hotel.country}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="hotel-switcher__footer">
            <a href="/list-property" className="hotel-switcher__add-btn">
              <Plus size={16} aria-hidden="true" />
              Add a property
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

function getHotelColor(name: string): string {
  const colors = ['#fbbf24', '#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#f87171'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default HotelSwitcher;
