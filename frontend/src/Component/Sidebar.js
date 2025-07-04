import React, { useState } from 'react';
import { 
  FaHome, FaUsers, FaClipboardList, FaBoxOpen, FaReceipt, 
  FaChartBar, FaCog, FaCalendarAlt, FaUtensils, FaConciergeBell,
  FaBroom, FaDesktop, FaBell, FaUser, FaSignOutAlt, FaBars,
  FaTimes, FaUserShield, FaUserTie, FaUserFriends
} from 'react-icons/fa';

// Sidebar Component
const Sidebar = ({ activeItem, setActiveItem, userRole, isOpen, toggleSidebar }) => {
  const menuItems = {
    Admin: [
      { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
      { id: 'employees', label: 'Employee Management', icon: <FaUsers /> },
      { id: 'inventory', label: 'Inventory', icon: <FaBoxOpen /> },
      { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
      { id: 'billing', label: 'Billing', icon: <FaReceipt /> },
      { id: 'leaves', label: 'Leave Management', icon: <FaCalendarAlt /> },
      { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ],
    Manager: [
      { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
      { id: 'inventory', label: 'Inventory', icon: <FaBoxOpen /> },
      { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
      { id: 'leaves', label: 'Leave Approvals', icon: <FaCalendarAlt /> },
    ],
    chef: [
      { id: 'ingredients', label: 'Ingredients', icon: <FaUtensils /> },
      { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
      { id: 'leave-apply', label: 'Apply Leave', icon: <FaCalendarAlt /> },
    ],
    Waiter: [
      { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
      { id: 'billing', label: 'Billing', icon: <FaReceipt /> },
      { id: 'leave-apply', label: 'Apply Leave', icon: <FaCalendarAlt /> },
    ],
    Housekeeping: [
      { id: 'cleaning-tasks', label: 'Cleaning Tasks', icon: <FaBroom /> },
      { id: 'leave-apply', label: 'Apply Leave', icon: <FaCalendarAlt /> },
    ],
    Receptionist: [
      { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
      { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
      { id: 'billing', label: 'Billing', icon: <FaReceipt /> },
      { id: 'leave-apply', label: 'Request Leave', icon: <FaCalendarAlt /> },
    ],
  };

  const currentMenuItems = menuItems[userRole] || [];

  return (
    <div className={`d_sidebar ${isOpen ? 'd_sidebar-open' : 'd_sidebar-closed'}`}>
      <div className="d_sidebar-header">
        <div className="d_logo-container">
          <FaUtensils className="d_logo-icon" />
          {isOpen && <span className="d_logo-text">RestaurantPro</span>}
        </div>
      </div>
      
      <nav className="d_sidebar-nav">
        <ul className="d_nav-list">
          {currentMenuItems.map((item) => (
            <li key={item.id} className="d_nav-item">
              <button
                className={`d_nav-link ${activeItem === item.id ? 'd_nav-link-active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                <span className="d_nav-icon">{item.icon}</span>
                {isOpen && <span className="d_nav-text">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="d_sidebar-footer">
        <div className="d_user-role-badge">
          <FaUserShield className="d_role-icon" />
          {isOpen && <span className="d_role-text">{userRole}</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;