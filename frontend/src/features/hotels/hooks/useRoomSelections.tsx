import { useContext } from 'react';
import { RoomSelectionsContext } from '../context/RoomSelectionsContext';

type UpdateRoomSelections = ({ roomTypeId, count }: { roomTypeId: string; count: number }) => void;

export default function useRoomSelections() {
  const value = useContext(RoomSelectionsContext);
  if (!value) throw new Error('the hook must be used within RoomSelections Provider scope');
  const { roomSelections, setRoomSelections } = value;

  const updateRoomSelections: UpdateRoomSelections = ({ roomTypeId, count }) => {
    setRoomSelections((prevSelections) => {
      const existingIndex = prevSelections.findIndex(
        (selection) => selection.roomTypeId === roomTypeId
      );

      if (count <= 0) {
        return existingIndex !== -1
          ? prevSelections.filter((selection) => selection.roomTypeId !== roomTypeId)
          : prevSelections;
      }

      if (existingIndex !== -1) {
        return prevSelections.map((selection, index) =>
          index === existingIndex ? { ...selection, count } : selection
        );
      }

      return [...prevSelections, { roomTypeId, count }];
    });
  };

  return { roomSelections, updateRoomSelections };
}

