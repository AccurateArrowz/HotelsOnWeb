import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  setActiveHotel,
  hydrateActiveHotel,
  clearActiveHotel,
  selectActiveHotel,
  selectActiveHotelId,
} from './hotelSlice';
import { useGetMyHotelsQuery } from './ownerHotelsApi';
import type { OwnerHotel } from './ownerHotelsApi';

interface UseActiveHotelReturn {
  hotel: OwnerHotel | null;
  hotelId: number | null;
  hotels: OwnerHotel[];
  isLoading: boolean;
  error: unknown;
  switchHotel: (hotel: OwnerHotel) => void;
  refetch: () => void;
}

export const useActiveHotel = (): UseActiveHotelReturn => {
  const dispatch = useAppDispatch();
  const hotel = useAppSelector(selectActiveHotel);
  const hotelId = useAppSelector(selectActiveHotelId);
  
  const {
    data: hotels = [],
    isLoading,
    error,
    refetch,
  } = useGetMyHotelsQuery();

  useEffect(() => {
    if (hotels.length > 0) {
      dispatch(hydrateActiveHotel(hotels));
    }
  }, [hotels, dispatch]);

  const switchHotel = useCallback(
    (newHotel: OwnerHotel) => {
      if (newHotel.id !== hotelId) {
        dispatch(setActiveHotel(newHotel));
      }
    },
    [dispatch, hotelId]
  );

  return {
    hotel,
    hotelId,
    hotels,
    isLoading,
    error,
    switchHotel,
    refetch,
  };
};

export const useClearActiveHotel = (): (() => void) => {
  const dispatch = useAppDispatch();
  
  return useCallback(() => {
    dispatch(clearActiveHotel());
  }, [dispatch]);
};

export default useActiveHotel;
