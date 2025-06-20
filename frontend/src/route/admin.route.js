import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../Component/Header';
import Sidebar from '../Component/Sidebar';
import Home from '../Container/Home';
import Register from '../Component/Register';
import '../Style/d_Style.css';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 991);
  const userRole = 'admin'; // Replace with auth state

  // Responsive sidebar toggle
  const handleSidebarToggle = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {/* <Header userRole={userRole} onLogout={() => alert('Logout')} onSidebarToggle={handleSidebarToggle} /> */}
      {/* <Sidebar userRole={userRole} isOpen={sidebarOpen} onClose={handleSidebarClose} /> */}
      <main className="d_mainContent">{children}</main>
    </div>
  );
}

function AdminRoutes() {
  return (
    // <AdminLayout>
    //   <Routes>
    //     {/* <Route path="/" element={<Home />} /> */}
    //     {/* <Route path="/header" element={<Header />} /> */}
    //   </Routes>
    // </AdminLayout>
    <Routes>
    {/* <Route path="/" element={<Home />} /> */}
    {/* <Route path="/header" element={<Header />} /> */}
    <Route path="/register" element={<Register />} />
  </Routes>
  );
}

export default AdminRoutes;
