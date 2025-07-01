import React, { useState } from 'react';
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaReceipt, FaCashRegister, FaChartBar, FaCalendarCheck, FaCog, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import BrandLogo from './BrandLogo';
import '../Style/d_Style.css';

const icons = {
  Dashboard: <FaTachometerAlt />,
  Employees: <FaUsers />,
  Inventory: <FaBoxOpen />,
  Orders: <FaReceipt />,
  Billing: <FaCashRegister />,
  Leaves: <FaCalendarCheck />,
  Settings: <FaCog />,
};

function Sidebar({ userRole = 'admin', isOpen = true, onClose, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  
  const [hovered, setHovered] = useState(false);
  const navLinks = {
    admin: [
      { label: 'Dashboard', path: '/' },
      { label: 'Employees', path: '/employees' },
      { label: 'Inventory', path: '/inventory' },
      // { label: 'Suppliers', path: '/suppliers' },
      { label: 'Orders', path: '/orders' },
      { label: 'Billing', path: '/billing' },
      { label: 'Leaves', path: '/leaves' },
      { label: 'Settings', path: '/settings' },
    ],
    manager: [
      { label: 'Dashboard', path: '/' },
      { label: 'Inventory', path: '/inventory' },
      // { label: 'Suppliers', path: '/suppliers' },
      { label: 'Orders', path: '/orders' },
      { label: 'Leaves', path: '/leaves' },
    ],
    chef: [
      { label: 'Ingredients', path: '/ingredients' },
      { label: 'Orders', path: '/orders' },
      { label: 'Leave Apply', path: '/leaves' },
    ],
    waiter: [
      { label: 'Orders', path: '/orders' },
      { label: 'Billing', path: '/billing' },
      { label: 'Leave Apply', path: '/leaves' },
    ],
    housekeeping: [
      { label: 'Cleaning Tasks', path: '/cleaning' },
      { label: 'Leave Apply', path: '/leaves' },
    ],
    receptionist: [
      { label: 'Dashboard', path: '/' },
      { label: 'Orders', path: '/orders' },
      { label: 'Billing', path: '/billing' },
      { label: 'Leave Apply', path: '/leaves' },
    ],
  };

  // Group links for section headings
  const sections = [
    { heading: 'Management', items: navLinks[userRole].slice(0, 5) },
    { heading: 'Settings', items: navLinks[userRole].slice(7) },
  ];

  // Get current path for active link highlight
  const currentPath = window.location.pathname;
  const handleLinkClick = () => {
    if (window.innerWidth <= 991) onClose();
  };

  // Sidebar expand/collapse on hover for desktop
  const isSidebarCollapsed = collapsed && !hovered;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && <div className="d_sidebarBackdrop d_show" onClick={onClose} />}
      <div
        className={`d_sidebar bg-white shadow d-flex flex-column position-fixed h-100 ${isOpen ? 'd_sidebarOpen' : 'd_sidebarClosed'}${isSidebarCollapsed ? ' d_sidebarCollapsed' : ''}`}
        style={{ top: 0, left: 0, borderTopLeftRadius: 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="d-flex flex-column align-items-center p-3 pb-0">
          <BrandLogo size={isSidebarCollapsed ? 24 : 28} fontSize={isSidebarCollapsed ? '1.1rem' : '1.3rem'} />
          {/* User Card */}
          <div className="d_userCard d-flex align-items-center mt-3 mb-2 w-100" style={{ gap: 10 }}>
            <FaUserCircle size={32} color="var(--d-primary)" />
            {!isSidebarCollapsed && (
              <div>
                <div style={{ fontWeight: 600, color: 'var(--d-primary)' }}>Admin</div>
                <div style={{ fontSize: 12, color: 'var(--d-primary-dark)' }}>Administrator</div>
              </div>
            )}
          </div>
        </div>
        <div className="d_sidebarHeader d-flex align-items-center justify-content-between p-3 border-bottom">
          {!isSidebarCollapsed && <span>Menu</span>}
          <button className="btn btn-sm btn-outline-secondary d_sidebarCloseBtn d-lg-none" onClick={onClose}>&times;</button>
        </div>
        <nav className="flex-grow-1 overflow-auto">
          {sections.map(section => (
            <div key={section.heading} className="mb-2">
              {!isSidebarCollapsed && <div className="d_sidebarSectionHeading px-4 pt-3 pb-1" style={{ fontSize: 13, color: 'var(--d-primary-dark)', fontWeight: 600 }}>{section.heading}</div>}
              <ul className="nav flex-column d_sidebarNav">
                {section.items.map(link => (
                  <li className="nav-item d_sidebarNavItem position-relative" key={link.path}>
                    <a
                      className={`nav-link d_sidebarNavLink d-flex align-items-center${currentPath === link.path ? ' active' : ''}`}
                      href={link.path}
                      onClick={handleLinkClick}
                      style={{ gap: 10 }}
                      title={isSidebarCollapsed ? link.label : undefined}
                    >
                      {icons[link.label] || <span style={{ width: 18 }} />}
                      {!isSidebarCollapsed && link.label}
                    </a>
                    {currentPath === link.path && <span className="d_activeIndicator" />}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* Logout at bottom */}
        <div className="d-flex flex-column align-items-center p-3 border-top mt-auto">
          <button
            className="btn btn-danger d-flex align-items-center d_sidebarLogoutBtn"
            style={{ borderRadius: 20, background: 'var(--d-primary)', border: 'none', color: 'var(--d-text-light)', fontWeight: 500 }}
            onClick={onLogout}
          >
            <FaSignOutAlt className="me-2" /> {!isSidebarCollapsed && 'Logout'}
          </button>
        </div>
        {/* Collapse button (desktop only, hidden on mobile) */}
        <button
          className="btn btn-light d-flex align-items-center d_sidebarCollapseBtn d-none d-lg-flex"
          style={{ borderRadius: 20, border: '1px solid var(--d-border)', color: 'var(--d-primary)', position: 'absolute', top: 12, right: -18, zIndex: 1200 }}
          onClick={() => setCollapsed(c => !c)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCollapsed(c => !c); } }}
          tabIndex={0}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <span>&#9654;</span> : <span>&#9664;</span>}
        </button>
      </div>
    </>
  );
}

export default Sidebar; 