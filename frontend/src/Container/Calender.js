import React, { useState } from 'react';
import './Calender.css';
import {
  Container, Row, Col, Card, Button, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { FaAnglesRight,FaAnglesLeft  } from "react-icons/fa6";


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
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const defaultLeaves = [
    ...Array.from({ length: 31 }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return d.getDay() === 0 ? `${year}-${month + 1}-${i + 1}` : null;
    }).filter(Boolean),
    `${year}-${month + 1}-10`,
    `${year}-${month + 1}-25`
  ];

  const users = [
    { name: 'Riya', type: 'Full Day', date: `${year}-${month + 1}-15`, role: 'Chef' },
    { name: 'Rakesh', type: 'Half Day', date: `${year}-${month + 1}-15`, role: 'Waiter' },
    { name: 'Zara', type: 'Full Day', date: `${year}-${month + 1}-22`, role: 'Receptionist' },
    { name: 'Amit', type: 'Full Day', date: `${year}-${month + 1}-22`, role: 'Manager' },
  ];

  const calendar = generateCalendar(year, month);

  const getTooltip = (date) => {
    const formatted = `${year}-${month + 1}-${date}`;
    if (defaultLeaves.includes(formatted)) return '🛑 Restaurant Holiday';
    const staff = users.filter(u => u.date === formatted);
    return staff.map(u => `👤 ${u.name} (${u.role}) - ${u.type}`).join('\n');
  };

  const getCellClass = (date) => {
    const formatted = `${year}-${month + 1}-${date}`;
    const classes = ['d_calendar-day'];

    if (formatted === todayStr) classes.push('d_today');
    if (defaultLeaves.includes(formatted)) {
      classes.push('d_restaurant-leave');
    } else if (users.some(u => u.date === formatted)) {
      classes.push('d_user-leave');
    }

    return classes.join(' ');
  };

  const getUserInitials = (date) => {
    const formatted = `${year}-${month + 1}-${date}`;
    if (defaultLeaves.includes(formatted)) return null;
    const userLeaves = users.filter(u => u.date === formatted);
    return userLeaves.map((u, i) => (
      <span className="d_user-badge" key={i}>
        {u.name.charAt(0)}
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
                <Button variant="light" className="me-2" onClick={() => changeMonth(-1)}><FaAnglesLeft></FaAnglesLeft></Button>
                <Button variant="light" onClick={() => changeMonth(1)}><FaAnglesRight ></FaAnglesRight></Button>
              </div>
            </Card.Header>
            <Card.Body>
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
                        overlay={<Tooltip className="d_tooltip">{tooltip}</Tooltip>}
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
               <div> <span className="d_box d_today_box"></span> Today</div>
             <div>   <span className="d_box d_red ms-3"></span> Restaurant Leave</div>
                <div><span className="d_box d_orange ms-3"></span> Staff Leave</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Calender;
