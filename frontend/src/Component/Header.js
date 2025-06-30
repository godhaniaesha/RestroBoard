import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import BrandLogo from './BrandLogo';
import '../Style/d_Style.css';

function Header({ userRole = 'admin', onLogout, onSidebarToggle }) {
  // Example nav links by role
  const navLinks = {
    admin: [
      { label: 'Dashboard', path: '/' },
      { label: 'Employees', path: '/employees' },
      { label: 'Inventory', path: '/inventory' },
      { label: 'Orders', path: '/orders' },
      { label: 'Billing', path: '/billing' },
      { label: 'Leaves', path: '/leaves' },
      { label: 'Settings', path: '/settings' },
    ],
    manager: [
      { label: 'Dashboard', path: '/' },
      { label: 'Inventory', path: '/inventory' },
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

  return (
    <nav className="navbar navbar-expand-lg d_navbar fixed-top shadow-sm d-flex align-items-center">
      <div className="container-fluid">
        {/* Hamburger for mobile */}
        <button className="d_navbarToggler d-lg-none me-2" type="button" onClick={onSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </button>
        <BrandLogo size={28} fontSize="1.3rem" style={{ minWidth: 160 }} />
        {/* Search bar */}
        <form className="d-none d-md-flex ms-4 flex-grow-1" style={{ maxWidth: 350 }}>
          <input
            className="form-control d_searchInput"
            type="search"
            placeholder="Search..."
            aria-label="Search"
            style={{ borderRadius: 20, border: '1px solid var(--d-border)', background: 'var(--d-bg)', color: 'var(--d-text)' }}
          />
        </form>
        <div className="d-flex align-items-center ms-auto d_navbarUser">
          <button className="btn position-relative me-3" style={{ background: 'none', border: 'none' }}>
            <FaBell size={20} color="var(--d-primary)" />
            <span style={{
              position: 'absolute', top: 0, right: 0, background: 'var(--d-accent)', color: '#fff',
              borderRadius: '50%', fontSize: 10, width: 16, height: 16, display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>3</span>
          </button>
          <div className="dropdown">
            <button className="btn dropdown-toggle d-flex align-items-center" style={{ background: 'none', border: 'none' }} data-bs-toggle="dropdown">
              <FaUserCircle size={28} color="var(--d-primary)" className="me-2" />
              <span className="d-none d-md-inline">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="/profile">Profile</a></li>
              <li><button className="dropdown-item" onClick={onLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;