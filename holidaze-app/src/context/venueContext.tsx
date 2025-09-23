import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Media {
  url: string;
  alt?: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
}

interface VenuesContextType {
  venues: Venue[];
  setVenues: (venues: Venue[]) => void;
  addVenue: (venue: Venue) => void;
}

const VenuesContext = createContext<VenuesContextType | undefined>(undefined);

interface VenuesProviderProps {
  children: ReactNode;
}

export const VenuesProvider: React.FC<VenuesProviderProps> = ({ children }) => {
  const [venues, setVenuesState] = useState<Venue[]>([]);

  const setVenues = useCallback((newVenues: Venue[]) => {
    setVenuesState(newVenues);
  }, []);

  const addVenue = useCallback((venue: Venue) => {
    setVenuesState(prev => [venue, ...prev]);
  }, []);

  return (
    <VenuesContext.Provider value={{ venues, setVenues, addVenue }}>
      {children}
    </VenuesContext.Provider>
  );
};

export const useVenues = (): VenuesContextType => {
  const context = useContext(VenuesContext);
  if (!context) throw new Error("useVenues must be used within a VenuesProvider");
  return context;
};
