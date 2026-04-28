import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OwnerHotel } from './ownerHotelsApi';

interface HotelState {
  activeHotelId: number | null;
  activeHotel: OwnerHotel | null;
}

const STORAGE_KEY = 'activeHotelId';

const getInitialHotelId = (): number | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

const initialState: HotelState = {
  activeHotelId: getInitialHotelId(),
  activeHotel: null,
};

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setActiveHotel: (state, action: PayloadAction<OwnerHotel | null>) => {
      state.activeHotel = action.payload;
      state.activeHotelId = action.payload?.id ?? null;
      
      if (action.payload?.id) {
        localStorage.setItem(STORAGE_KEY, action.payload.id.toString());
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    
    clearActiveHotel: (state) => {
      state.activeHotel = null;
      state.activeHotelId = null;
      localStorage.removeItem(STORAGE_KEY);
    },
    
    hydrateActiveHotel: (state, action: PayloadAction<OwnerHotel[]>) => {
      const hotels = action.payload;
      
      if (state.activeHotelId) {
        const found = hotels.find((h) => h.id === state.activeHotelId);
        if (found) {
          state.activeHotel = found;
          return;
        }
      }
      
      if (hotels.length > 0) {
        state.activeHotel = hotels[0];
        state.activeHotelId = hotels[0].id;
        localStorage.setItem(STORAGE_KEY, hotels[0].id.toString());
      }
    },
  },
});

export const { setActiveHotel, clearActiveHotel, hydrateActiveHotel } = hotelSlice.actions;

export const selectActiveHotel = (state: { hotel?: HotelState }) => state.hotel?.activeHotel ?? null;
export const selectActiveHotelId = (state: { hotel?: HotelState }) => state.hotel?.activeHotelId ?? null;

export default hotelSlice.reducer;
