import { createContext, useState } from "react";

export type RoomSelections = Array<{
  roomTypeId: string,
  count: number,
}>;

type RoomSelectionsContextValue = {
  roomSelections: RoomSelections ,
  setRoomSelections: React.Dispatch<React.SetStateAction<RoomSelections>>,
};

export const RoomSelectionsContext = createContext<RoomSelectionsContextValue | null>(null);

export const RoomSelectionsProvider = ({ children }: React.PropsWithChildren) => {
    const [roomSelections, setRoomSelections] = useState<RoomSelections >([]);
    
    return <RoomSelectionsContext.Provider value={{roomSelections, setRoomSelections}}>
        {children}
    </RoomSelectionsContext.Provider>
};