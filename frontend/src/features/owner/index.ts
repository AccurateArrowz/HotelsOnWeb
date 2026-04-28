// Owner feature exports

// API slices
export { ownerHotelsApi, useGetMyHotelsQuery, useGetMyHotelByIdQuery } from './ownerHotelsApi';
export { roomsApi, useGetRoomsByHotelQuery, useCreateRoomMutation, useUpdateRoomMutation, useDeleteRoomMutation } from './roomsApi';
export { roomTypesApi, useGetRoomTypesByHotelQuery, useCreateRoomTypeMutation, useUpdateRoomTypeMutation, useDeleteRoomTypeMutation } from './roomTypesApi';
export { hotelRequestsApi, useCreateHotelRequestMutation } from './hotelRequestsApi';

// Redux slice
export {
  default as hotelReducer,
  setActiveHotel,
  clearActiveHotel,
  hydrateActiveHotel,
  selectActiveHotel,
  selectActiveHotelId,
} from './hotelSlice';

// Hooks
export { useActiveHotel, useClearActiveHotel } from './useActiveHotel';

// Components
export { default as HotelSwitcher } from './components/HotelSwitcher';
export { default as KPICard } from './components/KPICard';
export { default as RevenueChart } from './components/RevenueChart';
export { default as RoomManagement } from './components/RoomManagement';
export { default as RoomTypesManagement } from './components/RoomTypesManagement';
export { default as StatusBadge } from './components/StatusBadge';

// Pages
export { default as MyHotelPage } from './pages/MyHotelPage';
export { default as OwnerDashboard } from './pages/OwnerDashboard';
export { default as ListYourProperty } from './pages/ListYourProperty';

// Types
export type { OwnerHotel } from './ownerHotelsApi';
export type { Room, CreateRoomRequest, UpdateRoomRequest } from './roomsApi';
export type { RoomType, CreateRoomTypeRequest, UpdateRoomTypeRequest } from './roomTypesApi';
