import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Register from '../Component/Register';
import PrivateRoutes from './PrivateRoutes'; 

function AdminRoutes() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      if (updatedToken !== token) {
        setToken(updatedToken);
        if (updatedToken) {
          navigate('/');
        } else {
          navigate('/login');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      const updatedToken = localStorage.getItem('token');
      if (updatedToken !== token) {
        setToken(updatedToken);
        if (!updatedToken) {
          navigate('/login');
        }
      }
    }, 300);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token, navigate]);

  return (
    <Routes>
      {!token ? (
        <>
          <Route path="/login" element={<Register />} />
          <Route path="*" element={<Register />} />
        </>
      ) : (
        <Route path="/*" element={<PrivateRoutes />} />
      )}
    </Routes>
  );
}

export default AdminRoutes;
