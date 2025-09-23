import { useState, useCallback, useMemo } from "react";

export interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

const MIN_GUESTS: Guests = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};

export const useGuests = (maxGuests: number) => {
  const [guests, setGuests] = useState<Guests>({ ...MIN_GUESTS });

  const totalAdultsChildren = useMemo(() => guests.adults + guests.children, [guests]);

  const increment = useCallback(
    (type: keyof Guests) => {
      setGuests(prev => {
        if ((type === "adults" || type === "children") && totalAdultsChildren >= maxGuests) {
          return prev;
        }
        return { ...prev, [type]: prev[type] + 1 };
      });
    },
    [maxGuests, totalAdultsChildren]
  );

  const decrement = useCallback((type: keyof Guests) => {
    setGuests(prev => {
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
