import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/**
 * Represents a media item for a venue (image/video).
 */
export interface Media {
  url: string;
  alt?: string;
}

/**
 * Represents a venue with core details.
 */
export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
}

/**
 * Context type for managing venues.
 */
interface VenuesContextType {
  /** List of venues */
  venues: Venue[];
  /** Replace the entire venues array */
  setVenues: (venues: Venue[]) => void;
  /** Add a new venue to the start of the array */
  addVenue: (venue: Venue) => void;
}

const VenuesContext = createContext<VenuesContextType | undefined>(undefined);

/**
 * Props for the VenuesProvider
 */
interface VenuesProviderProps {
  children: ReactNode;
}

/**
 * Provides venue state and management functions to children components.
 */
export const VenuesProvider: React.FC<VenuesProviderProps> = ({ children }) => {
  const [venues, setVenuesState] = useState<Venue[]>([]);

  /**
   * Replace the entire list of venues.
   * @param newVenues - array of venues to set
   */
  const setVenues = useCallback((newVenues: Venue[]) => {
    setVenuesState(newVenues);
  }, []);

  /**
   * Add a new venue to the start of the list.
   * @param venue - venue to add
   */
  const addVenue = useCallback((venue: Venue) => {
    setVenuesState((prev) => [venue, ...prev]);
  }, []);

  return (
    <VenuesContext.Provider value={{ venues, setVenues, addVenue }}>
      {children}
    </VenuesContext.Provider>
  );
};

/**
 * Hook to access venues context.
 * @returns {VenuesContextType} - venues state and management functions
 * @throws Will throw an error if used outside a VenuesProvider
 */
export const useVenues = (): VenuesContextType => {
  const context = useContext(VenuesContext);
  if (!context)
    throw new Error("useVenues must be used within a VenuesProvider");
  return context;
};
