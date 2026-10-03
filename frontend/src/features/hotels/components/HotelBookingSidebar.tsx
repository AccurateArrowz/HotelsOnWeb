import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RoomType } from '@hotelsonweb/shared';

interface HotelBookingSidebarProps {
  sidebarPrice: number;
  selectedRoomType: RoomType | null;
  checkIn: Date | null;
  checkOut: Date | null;
  setDateRange: (dates: [Date | null, Date | null]) => void;
  setSelectedRoomType: (roomType: RoomType | null) => void;
  nights: number;
  subtotal: number;
  SERVICE_FEE: number;
  total: number;
  handleBookNow: () => void;
}

export const HotelBookingSidebar: React.FC<HotelBookingSidebarProps> = ({
  sidebarPrice,
  selectedRoomType,
  checkIn,
  checkOut,
  setDateRange,
  setSelectedRoomType,
  nights,
  subtotal,
  SERVICE_FEE,
  total,
  handleBookNow,
}) => {
  return (
    <aside className="hotel-booking-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-price-row">
          <span className="sidebar-price">Rs.{sidebarPrice.toLocaleString()}</span>
          <span className="sidebar-price-label"> / night</span>
        </div>
        {selectedRoomType && (
          <div className="sidebar-selected-room">
            {selectedRoomType.name}
          </div>
        )}

        <div className="sidebar-dates">
          <div className="sidebar-date-field">
            <label className="sidebar-date-label">Check-in</label>
            <DatePicker
              selected={checkIn}
              onChange={(dates: any) => {
                setDateRange(dates);
                setSelectedRoomType(null);
              }}
              selectsRange
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              dateFormat="MMM d, yyyy"
              placeholderText="Add date"
              className="sidebar-date-input"
              popperPlacement="bottom-start"
            />
          </div>
          <div className="sidebar-date-field">
            <label className="sidebar-date-label">Check-out</label>
            <DatePicker
              selected={checkOut}
              onChange={(dates: any) => {
                setDateRange(dates);
                setSelectedRoomType(null);
              }}
              selectsRange
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              dateFormat="MMM d, yyyy"
              placeholderText="Add date"
              className="sidebar-date-input"
              popperPlacement="bottom-end"
            />
          </div>
        </div>

        {nights > 0 && (
          <div className="sidebar-breakdown">
            <div className="breakdown-row">
              <span>
                Rs.{sidebarPrice.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
              </span>
              <span>Rs.{subtotal.toLocaleString()}</span>
            </div>
            <div className="breakdown-row">
              <span>Service fee</span>
              <span>Rs.{SERVICE_FEE.toLocaleString()}</span>
            </div>
            <div className="breakdown-divider" />
            <div className="breakdown-row breakdown-total">
              <span>Total</span>
              <span>Rs.{total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button type="button" className="sidebar-book-btn" onClick={handleBookNow}>
          Book Now
        </button>
        <p className="sidebar-no-charge">You won't be charged yet</p>
      </div>
    </aside>
  );
};
