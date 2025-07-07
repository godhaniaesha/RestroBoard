import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Style/x_app.css";

function parseToDate(val) {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val === "string") {
    // Try to parse string in dd/mm/yyyy or yyyy-mm-dd
    if (val.includes("/")) {
      // dd/mm/yyyy
      const [d, m, y] = val.split("/");
      return new Date(`${y}-${m}-${d}`);
    }
    // fallback to Date constructor
    return new Date(val);
  }
  return new Date();
}

const CustomCalendar = ({ onDateSelect, initialDate }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(parseToDate(initialDate));

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(parseToDate(initialDate));
    }
  }, [initialDate]);

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="x_calendar-container">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        inline
        minDate={today}
        calendarClassName="x_calendar"
        dayClassName={(date) =>
          date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear()
            ? "x_day selected react-datepicker__day--selected"
            : "x_day"
        }
      />
    </div>
  );
};

export default CustomCalendar;
