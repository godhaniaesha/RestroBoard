import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../Container/Home';
import Register from '../Component/Register';
import '../Style/d_Style.css';
import CustomCalendar from '../Component/CustomCalendar';
import RestaurantAdminPanel from '../Component/RestaurantAdminPanel';
import AddCategory from '../Container/AddCategory';

function AdminRoutes() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Listen for localStorage token changes in the same tab
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedToken = localStorage.getItem('token');
      if (updatedToken !== token) {
        setToken(updatedToken);
        if (updatedToken) {
          navigate('/'); // redirect to home/dashboard after login
        }
      }
    }, 300); // Poll every 300ms (smooth enough for login actions)

    return () => clearInterval(interval);
  }, [token, navigate]);

  return (
    <Routes>
      {!token ? (
        <Route path="*" element={<Register />} />
      ) : (
        <>
          <Route path="/register" element={<Register />} />
          <Route path="/CustomCalendar" element={<CustomCalendar />} />
          <Route path="/" element={<RestaurantAdminPanel />} />
        </>
      )}
    </Routes>
  );
}

export default AdminRoutes;
