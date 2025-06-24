import React, { useState, useEffect, useRef } from 'react';
import {
  FaHome, FaUsers, FaClipboardList, FaBoxOpen, FaReceipt,
  FaChartBar, FaCog, FaCalendarAlt, FaUtensils, FaConciergeBell,
  FaBroom, FaDesktop, FaBell, FaUser, FaSignOutAlt, FaBars,
  FaTimes, FaUserShield, FaUserTie, FaUserFriends, FaChevronDown,
  FaChevronRight, FaPlus, FaEdit, FaTrash, FaEye, FaFileAlt,
  FaUserPlus, FaUserMinus, FaClock, FaCheck
} from 'react-icons/fa';
import './RestaurantAdminPanel.css';
import DashboardOverview from '../Container/DashboardOverview';
import AddEmployee from '../Container/AddEmployee';
import EmployeeList from '../Container/EmployeeList';
import PendingLeave from '../Container/PendingLeave';
import ApprovedLeave from '../Container/ApprovedLeave';
import StockManagement from '../Container/StockManagement';
import Billing from '../Container/Billing';
import Reports from '../Container/Reports';
import Calender from '../Container/Calender';
import AddItems from '../Container/AddItems';
import AddSupplier from '../Container/AddSupplier';
import AddLeave from '../Container/AddLeave';
import ActiveOrder from '../Container/ActiveOrder';
import DashAnalytics from '../Container/DashAnalytics';

// Sidebar Component
const Sidebar = ({ activeItem, setActiveItem, userRole, isOpen, toggleSidebar, isMobile, isHovered, setIsHovered }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const prevActiveItemRef = useRef(activeItem);
  const prevIsOpenRef = useRef(isOpen);
  const prevIsMobileRef = useRef(isMobile);

  const menuItems = {
    Admin: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <FaHome />,
        subItems: [
          { id: 'dashboard-overview', label: 'Overview', icon: <FaEye /> },
          { id: 'dashboard-analytics', label: 'Analytics', icon: <FaChartBar /> }
        ]
      },
      {
        id: 'employees',
        label: 'Employee Management',
        icon: <FaUsers />,
        subItems: [
          { id: 'employees-list', label: 'All Employees', icon: <FaUsers /> },
          { id: 'employees-add', label: 'Add Employee', icon: <FaUserPlus /> },
          { id: 'employees-roles', label: 'Manage Roles', icon: <FaUserShield /> }
        ]
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: <FaBoxOpen />,
        subItems: [
          { id: 'inventory-stock', label: 'Stock Management', icon: <FaBoxOpen /> },
          { id: 'inventory-add', label: 'Add Items', icon: <FaPlus /> },
          { id: 'supplier-add', label: 'Add supplier', icon: <FaPlus /> },
          { id: 'inventory-reports', label: 'Inventory Reports', icon: <FaFileAlt /> }
        ]
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: <FaClipboardList />,
        subItems: [
          { id: 'orders-active', label: 'Active Orders', icon: <FaClock /> },
          { id: 'orders-completed', label: 'Completed Orders', icon: <FaCheck /> },
          { id: 'orders-history', label: 'Order History', icon: <FaFileAlt /> }
        ]
      },
      { id: 'billing', label: 'Billing', icon: <FaReceipt /> },
      { id: 'reports', label: 'Reports', icon: <FaChartBar /> },
      {
        id: 'leaves',
        label: 'Leave Management',
        icon: <FaCalendarAlt />,
        subItems: [
          { id: 'leaves-pending', label: 'Pending Requests', icon: <FaClock /> },
          { id: 'leaves-approved', label: 'Approved Leaves', icon: <FaCheck /> },
          { id: 'leave-add', label: 'Add Leaves', icon: <FaCheck /> },
          { id: 'leaves-calendar', label: 'Leave Calendar', icon: <FaCalendarAlt /> }
        ]
      },
      { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ],
    Manager: [
      { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: <FaBoxOpen />,
        subItems: [
          { id: 'inventory-stock', label: 'Stock Management', icon: <FaBoxOpen /> },
          { id: 'inventory-reports', label: 'Inventory Reports', icon: <FaFileAlt /> }
        ]
      },
      { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
      { id: 'reports', label: 'Reports', icon: <FaChartBar /> },
      { id: 'leaves', label: 'Leave Approvals', icon: <FaCalendarAlt /> },
    ],
    Chef: [
      { id: 'ingredients', label: 'Ingredients', icon: <FaUtensils /> },
      {
        id: 'orders',
        label: 'Orders',
        icon: <FaClipboardList />,
        subItems: [
          { id: 'orders-pending', label: 'Pending Orders', icon: <FaClock /> },
          { id: 'orders-preparing', label: 'Preparing', icon: <FaUtensils /> },
          { id: 'orders-ready', label: 'Ready to Serve', icon: <FaCheck /> }
        ]
      },
      { id: 'leave-apply', label: 'Apply Leave', icon: <FaCalendarAlt /> },
    ],
    Waiter: [
      { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
      { id: 'billing', label: 'Billing', icon: <FaReceipt /> },
      { id: 'leave-apply', label: 'Apply Leave', icon: <FaCalendarAlt /> },
    ],
    Housekeeping: [
      {
        id: 'cleaning-tasks',
        label: 'Cleaning Tasks',
        icon: <FaBroom />,
        subItems: [
          { id: 'tasks-pending', label: 'Pending Tasks', icon: <FaClock /> },
          { id: 'tasks-completed', label: 'Completed Tasks', icon: <FaCheck /> }
        ]
      },
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

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => {
      const isCurrentlyExpanded = prev[menuId];

      if (isCurrentlyExpanded) {
        return {
          ...prev,
          [menuId]: false
        };
      } else {
        const newExpandedMenus = {};
        Object.keys(prev).forEach(key => {
          newExpandedMenus[key] = false;
        });
        newExpandedMenus[menuId] = true;
        return newExpandedMenus;
      }
    });
  };

  const handleMenuItemClick = (itemId, hasSubItems = false) => {
    if (hasSubItems) {
      toggleSubmenu(itemId);
    } else {
      setActiveItem(itemId);
      if (isMobile) {
        toggleSidebar();
      }
    }
  };

  const handleSubItemClick = (itemId) => {
    setActiveItem(itemId);
    if (isMobile) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    const activeItemChanged = prevActiveItemRef.current !== activeItem;
    const isOpenStateChanged = prevIsOpenRef.current !== isOpen;
    const isMobileStateChanged = prevIsMobileRef.current !== isMobile;

    // Update refs for the next render *after* using current values for logic
    prevActiveItemRef.current = activeItem;
    prevIsOpenRef.current = isOpen;
    prevIsMobileRef.current = isMobile;

    if (!isOpen && !isMobile) {
      // Desktop sidebar is closed.
      // If it was just closed (e.g., by toggleSidebar), ensure menus are cleared.
      // handleMouseLeave also clears menus on hover-out, but this is a safeguard for explicit toggle.
      if (isOpenStateChanged && !isOpen) {
        setExpandedMenus({});
      }
      return; // Let hover logic (handleSubmenuHover, handleMouseLeave) control expandedMenus
    }

    // At this point, sidebar is open (isOpen=true) OR it's mobile view (isMobile=true).
    // Synchronize expandedMenus if:
    // 1. activeItem changed.
    // 2. Sidebar just opened (isOpen changed from false to true).
    // 3. Mobile state changed (e.g. isMobile became true/false while sidebar might be open).

    const shouldUpdateBasedOnActiveItem =
      activeItemChanged ||
      (isOpenStateChanged && isOpen) || // Sidebar (desktop or mobile) just opened
      (isMobileStateChanged); // Mobile state itself changed, re-evaluate

    if (shouldUpdateBasedOnActiveItem) {
      let parentMenuIdToExpandBasedOnActiveItem = null;
      for (const item of currentMenuItems) {
        if (item.subItems && item.subItems.some(sub => sub.id === activeItem)) {
          parentMenuIdToExpandBasedOnActiveItem = item.id;
          break;
        }
      }

      if (parentMenuIdToExpandBasedOnActiveItem) {
        setExpandedMenus(() => { // Not relying on prev, setting fresh state based on activeItem
          const newExpandedMenus = {};
          currentMenuItems.forEach(menuItem => {
            if (menuItem.subItems) newExpandedMenus[menuItem.id] = false;
          });
          newExpandedMenus[parentMenuIdToExpandBasedOnActiveItem] = true;
          return newExpandedMenus;
        });
      } else {
        // Active item is not a sub-item, or no parent found. Close all submenus.
        setExpandedMenus({});
      }
    }
  }, [activeItem, currentMenuItems, isOpen, isMobile]); // Dependencies remain the same

  const handleMouseEnter = () => {
    if (!isMobile && !isOpen) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isOpen) {


      const timeout = setTimeout(() => {
        setIsHovered(false);

        setExpandedMenus({});

      }, 300); // 300ms delay

      setHoverTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Add a new function to handle submenu hover
  const handleSubmenuHover = (menuId) => {
    if (!isMobile && !isOpen && isHovered) {
      setExpandedMenus(prev => {
        const newExpandedMenus = {};
        Object.keys(prev).forEach(key => {
          newExpandedMenus[key] = false;
        });
        newExpandedMenus[menuId] = true;
        return newExpandedMenus;
      });
    }
  };

  const shouldShowExpanded = isOpen || isHovered || isMobile;

  return (
    <>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <div
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'sidebar-mobile' : ''} ${isHovered ? 'sidebar-hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={() => {
          // Keep hover state active when moving within sidebar
          if (!isMobile && !isOpen && !isHovered) {
            setIsHovered(true);
          }
        }}
      >
        <div className="sidebar-header">
          <div className="logo-container">
            <FaUtensils className="logo-icon" />
            {shouldShowExpanded && <span className="logo-text">RestaurantPro</span>}
          </div>
          {isMobile && (
            <button className="sidebar-close-btn" onClick={toggleSidebar}>
              <FaTimes />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {currentMenuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeItem === item.id ||
                    (item.subItems && item.subItems.some(sub => sub.id === activeItem))
                    ? 'nav-link-active' : ''
                    }`}
                  onClick={() => handleMenuItemClick(item.id, item.subItems && item.subItems.length > 0)}
                  onMouseEnter={() => handleSubmenuHover(item.id)}
                  title={!shouldShowExpanded ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {shouldShowExpanded && (
                    <>
                      <span className="nav-text">{item.label}</span>
                      {item.subItems && item.subItems.length > 0 && (
                        <span className={`nav-arrow ${expandedMenus[item.id] ? 'nav-arrow-expanded' : ''}`}>
                          {expandedMenus[item.id] ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {item.subItems && item.subItems.length > 0 && shouldShowExpanded && (
                  <ul className={`submenu ${expandedMenus[item.id] ? 'submenu-open' : 'submenu-closed'}`}>
                    {item.subItems.map((subItem) => (
                      <li key={subItem.id} className="submenu-item">
                        <button
                          className={`submenu-link ${activeItem === subItem.id ? 'submenu-link-active' : ''}`}
                          onClick={() => handleSubItemClick(subItem.id)}
                        >
                          <span className="submenu-icon">{subItem.icon}</span>
                          <span className="submenu-text">{subItem.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-role-badge">
            <FaUserShield className="role-icon" />
            {shouldShowExpanded && <span className="role-text">{userRole}</span>}
          </div>
        </div>
      </div>
    </>
  );
};

// Navbar Component
const Navbar = ({ userRole, toggleSidebar, isOpen, isMobile }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return <FaUserShield />;
      case 'Manager': return <FaUserTie />;
      default: return <FaUser />;
    }
  };

  // Handle sidebar toggle with proper event handling
  const handleSidebarToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if click is outside the profile dropdown
      if (showProfileMenu && !event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle"
          onClick={handleSidebarToggle}
          type="button"
          aria-label="Toggle Sidebar"
        >
          {isMobile ? <FaBars /> : (isOpen ? <FaTimes /> : <FaBars />)}
        </button>
        <h1 className="page-title">
          <span className="title-full">Restaurant Management System</span>
          <span className="title-short">RestaurantPro</span>
        </h1>
      </div>

      <div className="navbar-right">
        <div className="nav-actions">
          <button className="nav-btn notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>

          <div className="profile-dropdown" style={{ position: 'relative' }}>
            <button
              className="profile-btn"
              onClick={e => {
                e.stopPropagation();
                setShowProfileMenu(v => !v);
              }}
              type="button"
            >
              {getRoleIcon(userRole)}
              <span className="profile-name">{userRole}</span>
            </button>
            {showProfileMenu && (
              <div className="" style={{ position: 'absolute', right: 0, top: '100%', minWidth: 180, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 1000, borderRadius: 6, padding: 8 }}>
                <a href="#" className="dropdown-item"><FaUser /> Profile</a>
                <a href="#" className="dropdown-item"><FaCog /> Settings</a>
                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item logout"><FaSignOutAlt /> Logout</a>
              </div>
            )}

             {/* {showProfileMenu && (
              <div className="profile-menu ">
                <button className="profile-menu-item">
                  <FaUser />
                  <span>Profile</span>
                </button>
                <button className="profile-menu-item">
                  <FaCog />
                  <span>Settings</span>
                </button>
                <button className="profile-menu-item">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Content Router Component
const ContentRouter = ({ activeItem, userRole }) => {
  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
      case 'dashboard-overview':
        return (
          <>
            <DashboardOverview />
          </>
        );

      case 'dashboard-analytics':
        return (
         <DashAnalytics></DashAnalytics>
        );

      case 'employees':
      case 'employees-list':
        return (
          <>
            <EmployeeList></EmployeeList>
          </>
        );

      case 'employees-add':
        return (
          <>
            <AddEmployee></AddEmployee>
          </>
        );

      case 'employees-roles':
        return (
          <div className="content-section">
            <h2>Manage Employee Roles</h2>
            <div className="card">
              <div className="card-body">
                <p>Role management interface will be displayed here.</p>
              </div>
            </div>
          </div>
        );

      case 'orders':
      case 'orders-active':
        return (
          <>
          <ActiveOrder></ActiveOrder>
          </>
        );

      case 'orders-completed':
        return (
          <div className="content-section">
            <h2>Completed Orders</h2>
            <div className="card">
              <div className="card-body">
                <p>Completed orders list will be displayed here.</p>
              </div>
            </div>
          </div>
        );

      case 'orders-history':
        return (
          <div className="content-section">
            <h2>Order History</h2>
            <div className="card">
              <div className="card-body">
                <p>Order history and reports will be displayed here.</p>
              </div>
            </div>
          </div>
        );

      case 'inventory':
      case 'inventory-stock':
        return (
          // <div className="content-section">
          //   <h2>Inventory Management</h2>
          //   <div className="card">
          //     <div className="card-body">
          //       <div className="inventory-section">
          //         <h5>Stock Levels</h5>
          //         <div className="inventory-item">
          //           <span>Tomatoes</span>
          //           <div className="progress">
          //             <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
          //           </div>
          //           <span>75%</span>
          //         </div>
          //         <div className="inventory-item">
          //           <span>Rice</span>
          //           <div className="progress">
          //             <div className="progress-bar bg-warning" style={{ width: '25%' }}></div>
          //           </div>
          //           <span>25%</span>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <>
            <StockManagement></StockManagement>
          </>
        );

      case 'inventory-add':
        return (
        <>
          <AddItems></AddItems>
        </>
        );
        case 'supplier-add':
          return(
            <>
              <AddSupplier></AddSupplier>
            </>
          )
          case 'leave-add':
          return(
            <>
              <AddLeave></AddLeave>
            </>
          )
      case 'inventory-reports':
        return (
          <div className="content-section">
            <h2>Inventory Reports</h2>
            <div className="card">
              <div className="card-body">
                <p>Inventory reports and analytics will be displayed here.</p>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          // <div className="content-section">
          //   <h2>Billing & Payments</h2>
          //   <div className="card">
          //     <div className="card-body">
          //       <h5>Recent Transactions</h5>
          //       <div className="table-responsive">
          //         <table className="table">
          //           <thead>
          //             <tr>
          //               <th>Bill ID</th>
          //               <th>Table</th>
          //               <th>Amount</th>
          //               <th>Payment Method</th>
          //               <th>Status</th>
          //             </tr>
          //           </thead>
          //           <tbody>
          //             <tr>
          //               <td>#B001</td>
          //               <td>Table 3</td>
          //               <td>₹1,250</td>
          //               <td>Card</td>
          //               <td><span className="badge bg-success">Paid</span></td>
          //             </tr>
          //           </tbody>
          //         </table>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <>
            <Billing></Billing>
          </>
        );
      case 'reports':
        return (
          <>
            <Reports></Reports>
          </>
        )
      case 'leaves-approved':
        return (
          <>
            <ApprovedLeave></ApprovedLeave>
          </>
        )

        case 'leaves-calendar':
          return (
            <Calender />
          );
      default:
        return (
          // <div className="content-section">
          //   <h2>{activeItem.charAt(0).toUpperCase() + activeItem.slice(1).replace('-', ' ')}</h2>
          //   <div className="card">
          //     <div className="card-body">
          //       <p>Content for {activeItem} will be displayed here.</p>
          //       <p>This section is accessible to <strong>{userRole}</strong> role.</p>
          //     </div>
          //   </div>
          // </div>
          <>
            <PendingLeave></PendingLeave>
          </>
        );
    }
  };

  return <div className="main-content">{renderContent()}</div>;
};

// Main Component
const RestaurantAdminPanel = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [userRole, setUserRole] = useState('Admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Improved toggleSidebar function
  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarOpen); // Debug માટે
    setSidebarOpen(prevState => {
      const newState = !prevState;
      console.log('New sidebar state:', newState); // Debug માટે
      return newState;
    });

    // જો sidebar hover state માં છે તો તેને clear કરો
    if (isHovered) {
      setIsHovered(false);
    }
  };

  return (
    <div className='d_main_admin'>
      <div className={`admin-panel  ${!sidebarOpen ? 'sidebar-closed' : ''} ${isMobile ? 'mobile' : ''} ${isHovered && !sidebarOpen && !isMobile ? 'sidebar-hovered' : ''}`}>
        <Sidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          userRole={userRole}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />

        <div className="main-layout">
          <Navbar
            userRole={userRole}
            toggleSidebar={toggleSidebar}
            isOpen={sidebarOpen}
            isMobile={isMobile}
          />

          <ContentRouter
            activeItem={activeItem}
            userRole={userRole}
          />
        </div>

        <div className="role-switcher-container">
          <select
            className="role-switcher"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Chef">Chef</option>
            <option value="Waiter">Waiter</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdminPanel;