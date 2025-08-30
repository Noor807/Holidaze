import { useState } from "react";

export interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

const MIN_GUESTS = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};

export const useGuests = (maxGuests: number) => {
  const [guests, setGuests] = useState<Guests>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const totalAdultsChildren = guests.adults + guests.children;

  const increment = (type: keyof Guests) => {
    if (type === "adults" || type === "children") {
      if (totalAdultsChildren < maxGuests) {
        setGuests((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      }
    } else {
      setGuests((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };

  const decrement = (type: keyof Guests) => {
    if (guests[type] > MIN_GUESTS[type]) {
      setGuests((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    }
  };

  return {
    guests,
    setGuests,
    increment,
    decrement,
    totalAdultsChildren,
  };
};
