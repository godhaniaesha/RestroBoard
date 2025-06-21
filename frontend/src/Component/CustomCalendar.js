import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Style/x_app.css";

const CustomCalendar = ({ onDateSelect, initialDate }) => {
  const [selectedDate, setSelectedDate] = useState(
    initialDate
      ? new Date(initialDate.split("/").reverse().join("-"))
      : new Date()
  );

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(new Date(initialDate.split("/").reverse().join("-")));
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
