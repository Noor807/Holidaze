// src/context/venuesContext.tsx
import { createContext, useContext, useState,type ReactNode } from "react";


export interface Venue {
  id: string;
  name: string;
  description: string;
  media: { url: string; alt?: string }[];
  price: number;
  maxGuests: number;
}

interface VenuesContextType {
  venues: Venue[];
  setVenues: (venues: Venue[]) => void;
  addVenue: (venue: Venue) => void;
}

const VenuesContext = createContext<VenuesContextType | undefined>(undefined);

export const VenuesProvider = ({ children }: { children: ReactNode }) => {
  const [venues, setVenues] = useState<Venue[]>([]);

  const addVenue = (venue: Venue) => {
    setVenues(prev => [venue, ...prev]);
  };

  return (
    <VenuesContext.Provider value={{ venues, setVenues, addVenue }}>
      {children}
    </VenuesContext.Provider>
  );
};

export const useVenues = () => {
  const context = useContext(VenuesContext);
  if (!context) throw new Error("useVenues must be used within a VenuesProvider");
  return context;
};
