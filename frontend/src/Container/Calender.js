import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Calender.css';
import {
  Container, Row, Col, Card, Button, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import { db_getAllLeaves, db_clearLeaveState } from '../redux/slice/leave.slice';
import { jwtDecode } from 'jwt-decode';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const generateCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const calendar = [];

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDay) || date > totalDays) {
        week.push(null);
      } else {
        week.push(date++);
      }
    }
    calendar.push(week);
  }
  return calendar;
};

const Calender = () => {
  const dispatch = useDispatch();
  const { leaves, loading, success } = useSelector(state => state.leave);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    dispatch(db_getAllLeaves());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(db_getAllLeaves());
      dispatch(db_clearLeaveState());
    }
  }, [success, dispatch]);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userRole = decoded?.role;
  const loggedInUserId = decoded?._id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getCurrentMonthLeaves = () => {
    if (!leaves || leaves.length === 0) return [];

    return leaves.filter(leave => {
      if (!leave.start_date || !leave.userId) return false;

      const leaveDate = new Date(leave.start_date);
      const isSameMonth = leaveDate.getFullYear() === year && leaveDate.getMonth() === month;
      if (!isSameMonth) return false;

      if (userRole === 'admin' || userRole === 'manager') return true;

      return String(leave.userId) === String(loggedInUserId);
    });
  };

  const calendar = generateCalendar(year, month);
  const currentMonthLeaves = getCurrentMonthLeaves();

  const getTooltip = (date) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

    const staffOnLeave = currentMonthLeaves.filter(leave => {
      const leaveStartDate = formatDate(leave.start_date);
      const leaveEndDate = leave.end_date ? formatDate(leave.end_date) : leaveStartDate;
      return formatted >= leaveStartDate && formatted <= leaveEndDate;
    });

    if (staffOnLeave.length > 0) {
      return staffOnLeave.map(leave => {
        const emp = leave.emp_name || 'Unknown';
        const status = leave.leave_status || 'N/A';
        const startTime = leave.start_time;
        const endTime = leave.end_time;

        let duration = 'Full Day';
        if (startTime && endTime) {
          const [sh, sm] = startTime.split(':').map(Number);
          const [eh, em] = endTime.split(':').map(Number);
          let diff = (eh * 60 + em) - (sh * 60 + sm);
          if (diff < 0) diff += 1440;
          duration = `${(diff / 60).toFixed(1)} hour${diff !== 60 ? 's' : ''}`;
        }

        return `👤 ${emp}\n(${status})\n🕒 ${duration}`;
      }).join('\n\n');
    }

    return '';
  };

  const getCellClass = (date) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const classes = ['d_calendar-day'];

    if (formatted === todayStr) classes.push('d_today');

    const hasLeave = currentMonthLeaves.some(leave => {
      const leaveStartDate = formatDate(leave.start_date);
      const leaveEndDate = leave.end_date ? formatDate(leave.end_date) : leaveStartDate;
      return formatted >= leaveStartDate && formatted <= leaveEndDate;
    });

    if (hasLeave) classes.push('d_user-leave');
    return classes.join(' ');
  };

  const getUserInitials = (date) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

    const staffOnLeave = currentMonthLeaves.filter(leave => {
      const leaveStartDate = formatDate(leave.start_date);
      const leaveEndDate = leave.end_date ? formatDate(leave.end_date) : leaveStartDate;
      return formatted >= leaveStartDate && formatted <= leaveEndDate;
    });

    return staffOnLeave.map((leave, i) => (
      <span
        className={`d_user-badge ${leave.leave_status === 'approved'
          ? 'bg-success'
          : leave.leave_status === 'pending'
            ? 'bg-warning'
            : 'bg-danger'
          }`}
        key={i}
      >
        {leave.emp_name ? leave.emp_name.charAt(0).toUpperCase() : 'U'}
      </span>
    ));
  };

  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <Container fluid className="d_calender-wrapper py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="d_calender-card">
            <Card.Header className="d_calender-header d-flex justify-content-between flex-wrap align-items-center">
              <h5 className="mb-0">{monthNames[month]} {year}</h5>
              <div>
                <Button variant="light" className="me-2" onClick={() => changeMonth(-1)}>
                  <FaAnglesLeft />
                </Button>
                <Button variant="light" onClick={() => changeMonth(1)}>
                  <FaAnglesRight />
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {loading && (
                <div className="text-center mb-3">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              <div className="d_calendar-grid">
                {days.map((d, i) => (
                  <div key={i} className="d_calendar-day-name">{d}</div>
                ))}
                {calendar.map((week, i) =>
                  week.map((date, j) => {
                    if (!date) return <div key={`${i}-${j}`} className="d_calendar-day d_empty"></div>;

                    const tooltip = getTooltip(date);
                    const initials = getUserInitials(date);

                    return (
                      <OverlayTrigger
                        key={`${i}-${j}`}
                        overlay={<Tooltip className="d_tooltip">{tooltip || 'No leaves'}</Tooltip>}
                        placement="top"
                      >
                        <div className={getCellClass(date)}>
                          {date}
                          {initials && <div className="d_leave-users">{initials}</div>}
                        </div>
                      </OverlayTrigger>
                    );
                  })
                )}
              </div>

              <div className="d_legend mt-4">
                <div><span className="d_box d_today_box"></span> Today</div>
                <div><span className="d_box d_orange ms-3"></span> Staff Leave</div>
                <div><span className="d_box bg-success ms-3"></span> Approved</div>
                <div><span className="d_box bg-warning ms-3"></span> Pending</div>
                <div><span className="d_box bg-danger ms-3"></span> Rejected</div>
                <div className="ms-3 mt-2">
                  <small className="text-muted">
                    Showing {currentMonthLeaves.length} leave(s) for {monthNames[month]} {year}
                    {userRole !== 'admin' && userRole !== 'manager' && ' (Your leaves only)'}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Calender;
