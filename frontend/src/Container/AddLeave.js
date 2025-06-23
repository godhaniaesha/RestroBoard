import React, { useRef, useState, useEffect } from "react";
import CustomCalendar from "../Component/CustomCalendar";
import "../Style/x_app.css";
import XCustomSelect from "../Component/XCustomSelect";

export default function AddLeave() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  const startCalendarRef = useRef(null);
  const startInputRef = useRef(null);
  const endCalendarRef = useRef(null);
  const endInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        startCalendarRef.current &&
        !startCalendarRef.current.contains(event.target) &&
        startInputRef.current &&
        !startInputRef.current.contains(event.target)
      ) {
        setShowStartCalendar(false);
      }
      if (
        endCalendarRef.current &&
        !endCalendarRef.current.contains(event.target) &&
        endInputRef.current &&
        !endInputRef.current.contains(event.target)
      ) {
        setShowEndCalendar(false);
      }
    }
    if (showStartCalendar || showEndCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartCalendar, showEndCalendar]);

  const handleStartDateSelect = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formatted = date.toLocaleDateString("en-GB");
      setStartDate(formatted);
      setShowStartCalendar(false);
    }
  };

  const handleEndDateSelect = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formatted = date.toLocaleDateString("en-GB");
      setEndDate(formatted);
      setShowEndCalendar(false);
    }
  };

  return (
    <>
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Leave Application Form</h4>

        <div className="x_popup">
          <form className="row g-3 mt-3">
            <div className="col-md-6">
              <label htmlFor="employeeName" className="form-label">
                Employee Name
              </label>
              <input
                type="text"
                className="form-control"
                id="employeeName"
                name="employeeName"
                placeholder="Enter your name"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="leaveType" className="form-label">
                Leave Type
              </label>
              <XCustomSelect
                options={[
                  { value: "Annual", label: "Annual Leave" },
                  { value: "Sick", label: "Sick Leave" },
                  { value: "Personal", label: "Personal Leave" },
                  { value: "Unpaid", label: "Unpaid Leave" },
                ]}
                value={selectedLeaveType}
                onChange={setSelectedLeaveType}
                placeholder="Select Leave Type..."
                name="leaveType"
                id="leaveType"
                required
              />
            </div>

            <div className="col-md-6" style={{ position: "relative" }}>
              <label htmlFor="start_date" className="form-label">
                Start Date
              </label>
              <input
                className="form-control datetimepicker "
                id="start_date"
                type="text"
                placeholder="dd/mm/yyyy"
                value={startDate}
                readOnly
                ref={startInputRef}
                onClick={() => setShowStartCalendar(true)}
              />
              {showStartCalendar && (
                <div
                  ref={startCalendarRef}
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    top: "100%",
                    left: 0,
                  }}
                >
                  <CustomCalendar
                    onDateSelect={handleStartDateSelect}
                    initialDate={startDate}
                  />
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="start_time" className="form-label">
                Start Time
              </label>
              <input
                type="time"
                className="form-control"
                id="start_time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="col-md-6" style={{ position: "relative" }}>
              <label htmlFor="end_date" className="form-label">
                End Date
              </label>
              <input
                className="form-control datetimepicker "
                id="end_date"
                type="text"
                placeholder="dd/mm/yyyy"
                value={endDate}
                readOnly
                ref={endInputRef}
                onClick={() => setShowEndCalendar(true)}
              />
              {showEndCalendar && (
                <div
                  ref={endCalendarRef}
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    top: "100%",
                    left: 0,
                  }}
                >
                  <CustomCalendar
                    onDateSelect={handleEndDateSelect}
                    initialDate={endDate}
                  />
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="end_time" className="form-label">
                End Time
              </label>
              <input
                type="time"
                className="form-control"
                id="end_time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label htmlFor="reason" className="form-label">
                Reason for Leave
              </label>
              <textarea
                className="form-control"
                id="reason"
                name="reason"
                rows="4"
                placeholder="Please provide a reason for your leave request"
              ></textarea>
            </div>

            <div className="col-12 d-flex justify-content-center x_btn_main">
              <button type="button" className="btn btn-secondary mx-2">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary mx-2">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
