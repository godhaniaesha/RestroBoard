import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import {
    db_createLeave,
    db_updateLeaveDetails,
    db_clearLeaveState,
    db_getAllLeaves,
} from "../redux/slice/leave.slice";
import CustomCalendar from "../Component/CustomCalendar";
import XCustomSelect from "../Component/XCustomSelect";
import { toast, ToastContainer } from "react-toastify";
import { getRegisterById } from "../redux/slice/user.slice";
import { useNavigate } from "react-router-dom";

const LEAVE_TYPES = [
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Causal Leave", label: "Causal Leave" },
    { value: "Emergency Leave", label: "Emergency Leave" },
];

const LEAVE_STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
];


export default function EditLeave() {
    const params = new URLSearchParams(window.location.search);
    const leaveid = params?.id || null; // Get leave ID from URL params if available
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, success, error, leaves } = useSelector((state) => state.leave);
    const { userData } = useSelector((state) => state.user);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [empName, setEmpName] = useState("");
    const [reason, setReason] = useState("");

    const startCalendarRef = useRef(null);
    const startInputRef = useRef(null);
    const endCalendarRef = useRef(null);
    const endInputRef = useRef(null);

    const leaveId = leaveid || localStorage.getItem("editleaveid");

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
        if (leaveId && leaves.length === 0) {
            dispatch(db_getAllLeaves());
        }
    }, [leaveId, dispatch, leaves.length]);

    useEffect(() => {
        if (!leaveId || leaves.length === 0) return;

        const editLeave = leaves.find((leave) => leave._id === leaveId);
        if (editLeave) {
            setSelectedLeaveType({ label: editLeave.leave_type, value: editLeave.leave_type });
            setStartDate(new Date(editLeave.start_date).toLocaleDateString("en-GB"));
            setEndDate(new Date(editLeave.end_date).toLocaleDateString("en-GB"));
            setStartTime(editLeave.start_time || "");
            setEndTime(editLeave.end_time || "");
            setReason(editLeave.leave_reason || "");
            setSelectedStatus({ label: editLeave.leave_status, value: editLeave.leave_status });
        }
    }, [leaveId, leaves]);

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

    const formatToISO = (dateStr) => {
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!empName || !selectedLeaveType || !selectedStatus || !startDate || !endDate || !reason) {
            toast.error("Please fill all required fields.");
            return;
        }

        const isoStartDate = formatToISO(startDate);
        const isoEndDate = formatToISO(endDate);

        if (isNaN(new Date(isoStartDate)) || isNaN(new Date(isoEndDate))) {
            toast.error("Invalid date format. Please select dates again.");
            return;
        }

        const token = localStorage.getItem("token");
        let currentUserId = null;
        let currentUserRole = null;

        if (token) {
            try {
                const decoded = jwtDecode(token);
                currentUserId = decoded._id;
                currentUserRole = decoded.role;
            } catch (err) {
                console.error("Token decode error:", err);
                toast.error("User authentication failed.");
                return;
            }
        }

        console.log("Current User ID:", currentUserId);
        console.log("Current User Role:", currentUserRole);

        const payload = {

            leave_type: selectedLeaveType.value,
            start_date: new Date(isoStartDate).toISOString(),
            start_time: startTime,
            end_date: new Date(isoEndDate).toISOString(),
            end_time: endTime,
            leave_reason: reason,
            leave_status: selectedStatus.value,
            approvedBy: currentUserId,
            approvedByRole: currentUserRole,
        };

        if (leaveId) {
            dispatch(db_updateLeaveDetails({ id: leaveId, leaveData: payload }));
        } else {
            dispatch(db_createLeave(payload));
        }
    };

    useEffect(() => {
        if (success) {
            toast.success(leaveId ? "Leave updated successfully!" : "Leave request submitted successfully!");
            dispatch(db_clearLeaveState());
            localStorage.removeItem("editleaveid");

            setSelectedLeaveType(null);
            setSelectedStatus(null);
            setStartDate("");
            setStartTime("");
            setEndDate("");
            setEndTime("");
            setReason("");
            if (navigate) {
                navigate("/leaves-approved");
            }
        }

        if (error) {
            console.error("Leave submission error:", error);
            let message = "Something went wrong while submitting the leave.";
            if (typeof error === "string") {
                message = error;
            } else if (error?.msg) {
                message = error.msg;
            }

            toast.error(message);

            dispatch(db_clearLeaveState());

            // Delay navigation to allow toast to display
            setTimeout(() => {
                if (navigate) {
                    navigate("/leaves-approved");
                }
            }, 2500); // 2.5 seconds
        }

    }, [success, error, dispatch, leaveId, navigate]);

    return (
        <>
            <ToastContainer />
            <section className="x_employee-section">
                <h4 className="x_employee-heading">{leaveId ? "Edit Leave Request" : "Leave Application Form"}</h4>
                <div className="x_popup">
                    <form className="row g-3 mt-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label className="form-label">Employee Name</label>
                            <input type="text" className="form-control" value={empName} readOnly />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Leave Type</label>
                            <XCustomSelect
                                options={LEAVE_TYPES}
                                value={selectedLeaveType}
                                onChange={setSelectedLeaveType}
                                placeholder="Select Leave Type..."
                                required
                            />
                        </div>

                        <div className="col-md-6" style={{ position: "relative" }}>
                            <label className="form-label">Start Date</label>
                            <input
                                className="form-control datetimepicker"
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
                            <label className="form-label">Start Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6" style={{ position: "relative" }}>
                            <label className="form-label">End Date</label>
                            <input
                                className="form-control datetimepicker"
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
                            <label className="form-label">End Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Leave Status</label>
                            <XCustomSelect
                                options={LEAVE_STATUSES}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                placeholder="Select Leave Status..."
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Reason for Leave</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please provide a reason for your leave request"
                                required
                                maxLength={200}
                            ></textarea>
                        </div>

                        <div className="col-12 d-flex justify-content-center x_btn_main">
                            <button
                                type="button"
                                className="btn btn-secondary mx-2"
                                onClick={() => navigate && navigate("/leaves-approved")}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                                {loading ? "Submitting..." : leaveId ? "Update Leave" : "Submit Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
