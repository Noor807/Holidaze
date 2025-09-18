// src/components/BookingDatePicker.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../index.css"; 

interface BookingDatePickerProps {
  unavailableDates?: string[]; // ISO date strings like "2025-09-18"
  isLoggedIn: boolean;
  onChange?: (from: Date | null, to: Date | null) => void;
}

function toKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

const BookingDatePicker = ({
  unavailableDates = [],
  isLoggedIn,
  onChange,
}: BookingDatePickerProps) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<DateRange | undefined>(undefined);

  const disabledSet = new Set(unavailableDates);

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);

    const from = range?.from ?? null;
    const to = range?.to ?? null;

    if (typeof onChange === "function") onChange(from, to);

    if (from && to && !isLoggedIn) {
      alert("You need to log in to book this venue.");
      navigate("/login");
    }
  };

  const clearDates = () => setSelected(undefined);

  return (
    <div className="max-w-sm mx-auto text-center space-y-4">
      {/* Start Date */}
      <div className="flex flex-col">
        <label htmlFor="start-date" className="text-black font-medium mb-1">
          Start Date
        </label>
        <input
          id="start-date"
          type="text"
          value={selected?.from ? selected.from.toLocaleDateString() : ""}
          placeholder="Select start date"
          readOnly
          className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* End Date */}
      <div className="flex flex-col">
        <label htmlFor="end-date" className="text-black font-medium mb-1">
          End Date
        </label>
        <input
          id="end-date"
          type="text"
          value={selected?.to ? selected.to.toLocaleDateString() : ""}
          placeholder="Select end date"
          readOnly
          className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Clear Dates Button */}
      <button
        type="button"
        onClick={clearDates}
        className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-label="Clear selected dates"
      >
        Clear Dates
      </button>

      {/* Calendar */}
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        disabled={(date) => disabledSet.has(toKey(date))}
        modifiers={{
          available: (date) => !disabledSet.has(toKey(date)),
        }}
        modifiersStyles={{
          available: { backgroundColor: "#d1fae5", color: "#065f46" },
          disabled: { backgroundColor: "#f3f4f6", color: "#6b7280" },
        }}
        className="rdp-theme-green rounded-lg shadow-md"
      />
    </div>
  );
};

export default BookingDatePicker;
