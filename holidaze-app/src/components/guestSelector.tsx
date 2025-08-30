import React from "react";

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestSelectorProps {
  guests: Guests;
  maxGuests: number;
  onChange: (newGuests: Guests) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ guests, maxGuests, onChange }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const totalAdultsChildren = guests.adults + guests.children;

  const increment = (type: keyof Guests) => {
    if (type === "adults" || type === "children") {
      if (totalAdultsChildren < maxGuests) {
        onChange({ ...guests, [type]: guests[type] + 1 });
      }
    } else {
      onChange({ ...guests, [type]: guests[type] + 1 });
    }
  };

  const decrement = (type: keyof Guests) => {
    const minValues = { adults: 1, children: 0, infants: 0, pets: 0 };
    if (guests[type] > minValues[type]) {
      onChange({ ...guests, [type]: guests[type] - 1 });
    }
  };

  return (
    <div className="relative inline-block w-full max-w-xs">
      <button
        type="button"
        onClick={() => setShowDropdown((prev) => !prev)}
        className="w-full px-4 py-2 border border-black rounded text-left bg-white"
      >
        Guests: {totalAdultsChildren} + {guests.infants} infants + {guests.pets} pets
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow p-4 space-y-3">
          {(["adults", "children", "infants", "pets"] as (keyof Guests)[]).map((type) => (
            <div key={type} className="flex items-center justify-between">
              <span className="capitalize">{type}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => decrement(type)}
                  disabled={type === "adults" ? guests.adults <= 1 : guests[type] <= 0}
                  className={`px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  -
                </button>
                <span>{guests[type]}</span>
                <button
                  onClick={() => increment(type)}
                  className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
