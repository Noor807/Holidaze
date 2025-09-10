declare module "react-date-range" {
    import * as React from "react";
  
    export interface Range {
      startDate: Date;
      endDate: Date;
      key: string;
    }
  
    export interface DateRangeProps {
      ranges: Range[];
      onChange?: (ranges: { [key: string]: Range }) => void;
      editableDateInputs?: boolean;
      moveRangeOnFirstSelection?: boolean;
      showMonthAndYearPickers?: boolean;
      months?: number;
      direction?: "horizontal" | "vertical";
  
      // ✅ Add these optional props
      minDate?: Date;
      maxDate?: Date;
      rangeColors?: string[];
      disabledDates?: Date[];
    }
  
    export class DateRange extends React.Component<DateRangeProps> {}
  }
  