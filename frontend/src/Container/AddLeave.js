import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { db_createLeave, db_clearLeaveState, db_getAllLeaves } from "../redux/slice/leave.slice";
import CustomCalendar from "../Component/CustomCalendar";
import XCustomSelect from "../Component/XCustomSelect";
import "../Style/x_app.css";
import { toast, ToastContainer } from "react-toastify";
import { getRegisterById } from "../redux/slice/user.slice";
import { useNavigate } from "react-router-dom";

// Enum values
const LEAVE_TYPES = [
  { value: "Sick Leave", label: "Sick Leave" },
  { value: "Causal Leave", label: "Causal Leave" },
  { value: "Emergency Leave", label: "Emergency Leave" },
];

export default function AddLeave() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.leave);
  const { userData } = useSelector((state) => state.user);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [empName, setEmpName] = useState("");
  const [reason, setReason] = useState("");

  const startCalendarRef = useRef(null);
  const startInputRef = useRef(null);
  const endCalendarRef = useRef(null);
  const endInputRef = useRef(null);

  // Get employee name from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const fullName = `${decoded.firstName || ""} ${decoded.lastName || ""}`.trim();
        setEmpName(fullName);
        if (decoded._id) {
          dispatch(getRegisterById(decoded._id));
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (userData?.firstName || userData?.lastName) {
      const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
      setEmpName(fullName);
    }
  }, [userData]);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartCalendar, showEndCalendar]);

  const handleStartDateSelect = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setStartDate(date.toLocaleDateString("en-GB"));
      setShowStartCalendar(false);
    }
  };

  const handleEndDateSelect = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setEndDate(date.toLocaleDateString("en-GB"));
      setShowEndCalendar(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!empName || !selectedLeaveType || !startDate || !endDate || !reason) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      emp_name: empName,
      leave_type: selectedLeaveType.value,
      start_date: startDate.replace(/\//g, "-"),
      start_time: startTime,
      end_date: endDate.replace(/\//g, "-"),
      end_time: endTime,
      leave_reason: reason,
    };

    dispatch(db_createLeave(payload));
  };
useEffect(() => {
  if (success) {
    dispatch(db_getAllLeaves());
    dispatch(db_clearLeaveState());
  }
}, [success, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Leave request submitted successfully!");
      dispatch(db_clearLeaveState());

      // Reset form fields
      setSelectedLeaveType(null);
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setReason("");

      // Navigate if needed
      if (navigate) {
        setTimeout(() => {
          navigate("leaves-approved"); // Replace with your desired page
        }, 1000); // slight delay for user to see toast
      }
    }

    if (error) {
      toast.error(error);
      dispatch(db_clearLeaveState());
    }
  }, [success, error, dispatch, navigate]);


  return (
    <>
      <ToastContainer></ToastContainer>
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Leave Application Form</h4>
        <div className="x_popup">
          <form className="row g-3 mt-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label htmlFor="employeeName" className="form-label">Employee Name</label>
              <input
                type="text"
                className="form-control"
                id="employeeName"
                value={empName}
                readOnly
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="leaveType" className="form-label">Leave Type</label>
              <XCustomSelect
                options={LEAVE_TYPES}
                value={selectedLeaveType}
                onChange={setSelectedLeaveType}
                placeholder="Select Leave Type..."
                name="leaveType"
                id="leaveType"
                required
              />
            </div>

            <div className="col-md-6" style={{ position: "relative" }}>
              <label htmlFor="start_date" className="form-label">Start Date</label>
              <input
                className="form-control datetimepicker"
                id="start_date"
                type="text"
                placeholder="dd/mm/yyyy"
                value={startDate}
                readOnly
                ref={startInputRef}
                onClick={() => setShowStartCalendar(true)}
                required
              />
              {showStartCalendar && (
                <div ref={startCalendarRef} style={{ position: "absolute", zIndex: 10, top: "100%", left: 0 }}>
                  <CustomCalendar onDateSelect={handleStartDateSelect} initialDate={startDate} />
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="start_time" className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                id="start_time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="col-md-6" style={{ position: "relative" }}>
              <label htmlFor="end_date" className="form-label">End Date</label>
              <input
                className="form-control datetimepicker"
                id="end_date"
                type="text"
                placeholder="dd/mm/yyyy"
                value={endDate}
                readOnly
                ref={endInputRef}
                onClick={() => setShowEndCalendar(true)}
                required
              />
              {showEndCalendar && (
                <div ref={endCalendarRef} style={{ position: "absolute", zIndex: 10, top: "100%", left: 0 }}>
                  <CustomCalendar onDateSelect={handleEndDateSelect} initialDate={endDate} />
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="end_time" className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                id="end_time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label htmlFor="reason" className="form-label">Reason for Leave</label>
              <textarea
                className="form-control"
                id="reason"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for your leave request"
                required
                maxLength={200}
              ></textarea>
            </div>

            <div className="col-12 d-flex justify-content-center x_btn_main">
              <button type="reset" className="btn btn-secondary mx-2">Cancel</button>
              <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
