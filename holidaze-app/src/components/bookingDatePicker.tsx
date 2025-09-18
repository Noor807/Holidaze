import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../index.css";

interface BookingDatePickerProps {
  unavailableDates?: string[];
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
  const today = new Date();

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    const from = range?.from ?? null;
    const to = range?.to ?? null;
    onChange?.(from, to);

    if (from && to && !isLoggedIn) {
      alert("You need to log in to book this venue.");
      navigate("/login");
    }
  };

  const clearDates = () => setSelected(undefined);

  return (
    <fieldset className="max-w-sm mx-auto text-center space-y-4 border-0">
      <legend className="sr-only">Select booking dates</legend>

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
          tabIndex={0}
          className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
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
          tabIndex={0}
          className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <button
        type="button"
        onClick={clearDates}
        className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Clear Dates
      </button>

      {/* Calendar */}
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        disabled={[
          (date) => disabledSet.has(toKey(date)),
          { before: today },
        ]}
        modifiers={{
          available: (date) => !disabledSet.has(toKey(date)),
        }}
        modifiersStyles={{
          available: { backgroundColor: "#a7f3d0", color: "#064e3b" },
          disabled: { backgroundColor: "#f3f4f6", color: "#374151" },
        }}
        className="rounded-lg shadow-md"
        aria-label="Booking date range"
      />

      {/* Screen reader live region */}
      <div aria-live="polite" className="sr-only">
        {selected?.from && !selected?.to &&
          `Start date selected: ${selected.from.toLocaleDateString()}`}
        {selected?.from && selected?.to &&
          `Date range selected: ${selected.from.toLocaleDateString()} to ${selected.to.toLocaleDateString()}`}
      </div>
    </fieldset>
  );
};

export default BookingDatePicker;
