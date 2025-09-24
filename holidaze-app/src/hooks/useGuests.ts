import { useState, useCallback, useMemo } from "react";

/**
 * Represents the number of guests of each type.
 */
export interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

/** Minimum allowed guests for each type */
const MIN_GUESTS: Guests = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};

/**
 * Custom hook for managing guests count in a booking form.
 * Enforces a maximum limit for adults + children.
 *
 * @param maxGuests - Maximum number of guests (adults + children)
 * @returns An object with guest counts and helper functions
 */
export const useGuests = (maxGuests: number) => {
  const [guests, setGuests] = useState<Guests>({ ...MIN_GUESTS });

  /** Total number of adults + children (used for maxGuests check) */
  const totalAdultsChildren = useMemo(
    () => guests.adults + guests.children,
    [guests]
  );

  /**
   * Increment the count of a guest type.
   * Enforces maxGuests limit for adults + children.
   *
   * @param type - Type of guest to increment
   */
  const increment = useCallback(
    (type: keyof Guests) => {
      setGuests((prev) => {
        if (
          (type === "adults" || type === "children") &&
          totalAdultsChildren >= maxGuests
        ) {
          return prev;
        }
        return { ...prev, [type]: prev[type] + 1 };
      });
    },
    [maxGuests, totalAdultsChildren]
  );

  /**
   * Decrement the count of a guest type.
   * Cannot go below minimum allowed for that type.
   *
   * @param type - Type of guest to decrement
   */
  const decrement = useCallback((type: keyof Guests) => {
    setGuests((prev) => {
      if (prev[type] <= MIN_GUESTS[type]) return prev;
      return { ...prev, [type]: prev[type] - 1 };
    });
  }, []);

  return {
    guests,
    setGuests,
    increment,
    decrement,
    totalAdultsChildren,
  };
};
