// src/components/BookingDatePicker.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface BookingDatePickerProps {
  // ISO date strings: ["2025-02-01", "2025-02-02", ...]
  unavailableDates?: string[];
  isLoggedIn: boolean;
  onChange?: (from: Date | null, to: Date | null) => void;
}

function toKey(d: Date) {
  // normalize to YYYY-MM-DD in UTC (matches API style)
  return d.toISOString().slice(0, 10);
}

const BookingDatePicker = ({
  unavailableDates = [],
  isLoggedIn,
  onChange,
}: BookingDatePickerProps) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<DateRange | undefined>(undefined);

  // Build a Set for O(1) checks when coloring days
  const disabledSet = new Set(unavailableDates);

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);

    const from = range?.from ?? null;
    const to = range?.to ?? null;

    // Bubble up to parent (e.g., DetailedVenuePage) if provided
    if (typeof onChange === "function") {
      onChange(from, to);
    }

    // If a full range is chosen but user isn't logged in, prompt + redirect
    if (from && to && !isLoggedIn) {
      alert("You need to log in to book this venue.");
      navigate("/login", { replace: false });
    }
  };

  return (
    <div className="max-w-sm mx-auto text-center">
      <label className="block text-sm font-medium mb-2">
        Select your stay dates
      </label>

      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        // Disable the exact dates from the API
        disabled={(date) => disabledSet.has(toKey(date))}
        // Color available (not in disabledSet) vs disabled
        modifiers={{
          available: (date) => !disabledSet.has(toKey(date)),
        }}
        modifiersStyles={{
          // available days = green-ish
          available: { backgroundColor: "#d1fae5", color: "#065f46" },
          // disabled days = light gray
          disabled: { backgroundColor: "#f3f4f6", color: "#9ca3af" },
        }}
      />
    </div>
  );
};

export default BookingDatePicker;
