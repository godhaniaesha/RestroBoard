import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  FaHome, FaUsers, FaClipboardList, FaBoxOpen, FaReceipt,
  FaChartBar, FaCog, FaCalendarAlt, FaUtensils, FaConciergeBell,
  FaBroom, FaDesktop, FaBell, FaUser, FaSignOutAlt, FaBars,
  FaTimes, FaUserShield, FaUserTie, FaUserFriends, FaChevronDown,
  FaChevronRight, FaPlus, FaEdit, FaTrash, FaEye, FaFileAlt,
  FaUserPlus, FaUserMinus, FaClock, FaCheck,
  FaShippingFast,
  FaUserEdit,
  FaRegCalendarAlt,
  FaCalendarCheck,
  FaCalendarPlus,
  FaCalendarWeek
} from 'react-icons/fa';
import { BiSolidCategory } from "react-icons/bi";
import { HiViewGridAdd } from "react-icons/hi";
import { LuLayoutList } from "react-icons/lu";
import './RestaurantAdminPanel.css';
import DashboardOverview from '../Container/DashboardOverview';
import AddEmployee from '../Container/AddEmployee';
import EmployeeList from '../Container/EmployeeList';
import PendingLeave from '../Container/PendingLeave';
import ApprovedLeave from '../Container/ApprovedLeave';
import StockManagement from '../Container/StockManagement';
import Billing from '../Container/Billing';
import Calender from '../Container/Calender';
import AddItems from '../Container/AddItems';
import AddSupplier from '../Container/AddSupplier';
import AddLeave from '../Container/AddLeave';
import ActiveOrder from '../Container/ActiveOrder';
import HotelOverview from '../Container/HotelOverview';
import AddHO from '../Container/AddHO';
import AddDishes from '../Container/AddDishes';
import SupplierList from '../Container/SupplierList';
import AddCategory from '../Container/AddCategory';
import CategoryList from '../Container/CategoryList';
import { useDispatch } from 'react-redux';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import { logoutUser } from '../redux/slice/auth.slice';
import EditEmployee from '../Container/EditEmployee';
import { FaCalendarXmark, FaRegCalendarXmark } from 'react-icons/fa6';
import AddHoliday from '../Container/AddHoliday';
import Holidaylist from '../Container/Holidaylist';
import EditHolidays from '../Container/EditHolidays';
import EditSupplier from '../Container/EditSupplier';
import Spinner from '../Spinner';
import EditLeave from '../Container/EditLeave';
// import TakeNewOrderForm from './TakeNewOrderForm';

// Sidebar Component
const VALID_ROLES = ["admin", "manager", "supplyer", "chef", "waiter"];
const Sidebar = ({ userRole, isOpen, isMobile, isHovered, onToggleSidebar, onSetHovered }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Custom logic for category active state
  let activeItem;
  if (
    location.pathname === '/category-list' ||
    location.pathname === '/category-add' ||
    location.pathname.startsWith('/category-edit/')
  ) {
    activeItem = 'category-list';
  } else {
    activeItem =
      (userRole && ["admin", "manager"].includes(userRole.toLowerCase()))
        ? (location.pathname.substring(1) || 'dashboard-overview')
        : (location.pathname.substring(1) || 'leaves-calendar');
  }

  const prevActiveItemRef = useRef(activeItem);
  const prevIsOpenRef = useRef(isOpen);
  const prevIsMobileRef = useRef(isMobile);

  const menuItems = {
    admin: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <FaHome />,
        subItems: [
          { id: "dashboard-overview", label: "Overview", icon: <FaEye /> },
        ],
      },
      {
        id: "employees",
        label: "Employee Management",
        icon: <FaUsers />,
        subItems: [
          { id: "employees-list", label: "All Employees", icon: <FaUsers /> },
          { id: "employees-add", label: "Add Employee", icon: <FaUserPlus /> },
          {
            id: "employees-edit",
            label: "Edit Employee",
            icon: <FaUserEdit />,
            hidden: true,
          },
        ],
      },
      {
        id: "category",
        label: "Category",
        icon: <BiSolidCategory />,
        subItems: [
          {
            id: "category-list",
            label: "Category List",
            icon: <LuLayoutList />,
          },
          {
            id: "category-add",
            label: "Add Category",
            icon: <HiViewGridAdd style={{ width: "16px", height: "16px" }} />,
          },
          {
            id: "category-edit/",
            label: "Edit Category",
            icon: <FaEdit style={{ width: "16px", height: "16px" }} />,
            hidden: true,
          },
        ],
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: <FaBoxOpen />,
        subItems: [
          {
            id: "inventory-stock",
            label: "Stock Management",
            icon: <FaBoxOpen />,
          },
          { id: "inventory-add", label: "Add Items", icon: <FaPlus /> },
        ],
      },
      {
        id: "suppliers",
        label: "Suppliers",
        icon: <FaShippingFast />,
        subItems: [
          { id: "supplier-list", label: "Supplier List", icon: <FaUsers /> },
          { id: "supplier-add", label: "Add Supplier", icon: <FaUserPlus /> },
          { id: "supplier-edit", label: "Edit Supplier", icon: <FaUserEdit />, hidden: true },
        ],
      },
      {
        id: "hotel-information",
        label: "Hotel Information",
        icon: <FaDesktop />,
        subItems: [
          { id: "hotel-information", label: "Overview", icon: <FaEye /> },
          {
            id: "hotel-information-contact",
            label: "Contact Info",
            icon: <FaUserFriends />,
          },
          { id: "add-dish", label: "Add Dish", icon: <FaUserFriends /> },
        ],
      },
      {
        id: "leaves",
        label: "Leave Management",
        icon: <FaCalendarAlt />,
        subItems: [
          {
            id: "leaves-approved",
            label: "Approved Leaves",
            icon: <FaCheck />,
          },
          {
            id: 'edit-leaves',
            label: "Edit Leaves",
            icon: <FaUserEdit />,
            hidden: true,
          },
          {
            id: "leaves-calendar",
            label: "Leave Calendar",
            icon: <FaCalendarAlt />,
          },
        ],
      },
    ],
    manager: [
      { id: "dashboard-overview", label: "Dashboard", icon: <FaHome /> },
      {
        id: "category",
        label: "Category",
        icon: <BiSolidCategory />,
        subItems: [
          {
            id: "category-list",
            label: "Category List",
            icon: <LuLayoutList />,
          },
          {
            id: "category-add",
            label: "Add Category",
            icon: <HiViewGridAdd />,
          },
        ],
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: <FaBoxOpen />,
        subItems: [
          {
            id: "inventory-stock",
            label: "Stock Management",
            icon: <FaBoxOpen />,
          },
        ],
      },
      {
        id: "employees",
        label: "Employee Management",
        icon: <FaUsers />,
        subItems: [
          { id: "employees-list", label: "All Employees", icon: <FaUsers /> },
          { id: "employees-add", label: "Add Employee", icon: <FaUserPlus /> },
          {
            id: "employees-edit",
            label: "Edit Employee",
            icon: <FaUserEdit />,
            hidden: true,
          },
        ],
      },
      {
        id: "suppliers",
        label: "Suppliers",
        icon: <FaShippingFast />,
        subItems: [
          { id: "supplier-list", label: "Supplier List", icon: <FaUsers /> },
          { id: "supplier-add", label: "Add Supplier", icon: <FaUserPlus /> },
          { id: "supplier-edit", label: "Edit Supplier", icon: <FaUserEdit />, hidden: true }
        ],
      },
      {
        id: "hotel-information",
        label: "Hotel Information",
        icon: <FaDesktop />,
        subItems: [
          { id: "hotel-information", label: "Overview", icon: <FaEye /> },
          {
            id: "hotel-information-contact",
            label: "Contact Info",
            icon: <FaUserFriends />,
          },
          { id: "add-dish", label: "Add Dish", icon: <FaUserFriends /> },
        ],
      },
      {
        id: "leaves",
        label: "Leave Management",
        icon: <FaCalendarAlt />,
        subItems: [
          { id: "leave-add", label: "Add Leaves", icon: <FaCheck /> },
          {
            id: "leaves-approved",
            label: "Approved Leaves",
            icon: <FaCheck />,
          },
          {
            id: 'edit-leaves',
            label: "Edit Leaves",
            icon: <FaUserEdit />,
            hidden: true,
          },
          {
            id: "leaves-calendar",
            label: "Leave Calendar",
            icon: <FaCalendarAlt />,
          },
        ],
      },
    ],
    Housekeeping: [
      {
        id: "holidays",
        label: "Holidays",
        icon: <FaRegCalendarAlt />,
        subItems: [
          { id: "add-holiday", label: "Add Holiday", icon: <FaCalendarPlus /> },
          {
            id: "holidays-list",
            label: "Holiday List",
            icon: <FaRegCalendarXmark />,
          },
          {
            id: "holiday-edit",
            label: "Edit holiday",
            icon: <FaCalendarCheck />,
            hidden: true,
          },
        ],
      },
      { id: "leaves", label: "Leave Approvals", icon: <FaCalendarAlt /> },
    ],
    chef: [
      {
        id: "hotel-information",
        label: "Hotel Information",
        icon: <FaDesktop />,
      },

    
      {
        id: 'leaves', label: 'Leave', icon: <FaCalendarAlt />,
        subItems: [
          { id: "leave-add", label: "Add Leaves", icon: <FaCheck /> },
          {
            id: "leaves-calendar",
            label: "Leave Calendar",
            icon: <FaCalendarAlt />,
          },
          { id: 'leaves-approved', label: "Approved Leaves", icon: <FaCheck /> },

        ]
      },
    ],
    waiter: [
      {
        id: "hotel-information",
        label: "Hotel Information",
        icon: <FaDesktop />,
      },

      {
        id: 'leaves', label: 'Leave', icon: <FaCalendarAlt />,
        subItems: [
          { id: "leave-add", label: "Add Leaves", icon: <FaCheck /> },
          {
            id: "leaves-calendar",
            label: "Leave Calendar",
            icon: <FaCalendarAlt />,
          },
          { id: 'leaves-approved', label: "Approved Leaves", icon: <FaCheck /> },

        ]
      },
    ],
    supplyer: [
      {
        id: "cleaning-tasks",
        label: "Cleaning Tasks",
        icon: <FaBroom />,
        subItems: [
          { id: "tasks-pending", label: "Pending Tasks", icon: <FaClock /> },
          {
            id: "tasks-completed",
            label: "Completed Tasks",
            icon: <FaCheck />,
          },
        ],
      },
      {
        id: 'leaves', label: 'Leave', icon: <FaCalendarAlt />,
        subItems: [
          { id: "leave-add", label: "Add Leaves", icon: <FaCheck /> },
          {
            id: "leaves-calendar",
            label: "Leave Calendar",
            icon: <FaCalendarAlt />,
          },
          { id: 'leaves-approved', label: "Approved Leaves", icon: <FaCheck /> },

        ]
      },
    ],
    Receptionist: [
      { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
      {
        id: "hotel-information",
        label: "Hotel Information",
        icon: <FaDesktop />,
      },

      { id: "leave-apply", label: "Request Leave", icon: <FaCalendarAlt /> },
    ],
  };

  // For all other roles, only show Hotel Information (Overview) and Leave (Add, Calendar, Approved)
  const simpleMenu = [
    {
      id: "hotel-information",
      label: "Hotel Information",
      icon: <FaDesktop />,
      subItems: [
        { id: "hotel-information", label: "Overview", icon: <FaEye /> },
      ],
    },
    {
      id: 'leaves',
      label: 'Leave',
      icon: <FaCalendarAlt />,
      subItems: [
        { id: "leave-add", label: "Add Leaves", icon: <FaCheck /> },
        { id: "leaves-calendar", label: "Leave Calendar", icon: <FaCalendarAlt /> },
        { id: 'leaves-approved', label: "Approved Leaves", icon: <FaCheck /> },
      ],
    },
  ];

  // Ensure chef's orders are correctly defined with subItems if they weren't already
  // This block is for ensuring the structure matches the new subItems pattern
  if (userRole === 'chef' && !menuItems.chef.find(item => item.id === 'orders')?.subItems) {
    menuItems.chef = menuItems.chef.map(item => item.id === 'orders' ? { ...item, subItems: [{ id: 'orders-pending', label: 'Pending Orders', icon: <FaClock /> }, { id: 'orders-preparing', label: 'Preparing', icon: <FaUtensils /> }, { id: 'orders-ready', label: 'Ready to Serve', icon: <FaCheck /> }] } : item);
  }

  // Add 'Take New Order' to Waiter's orders sub-menu


  const currentMenuItems = menuItems[userRole?.toLowerCase?.()] || simpleMenu;

  // Add a Profile menu item for all roles
  const profileMenuItem = {
    id: "profile",
    label: "Profile",
    icon: <FaUser />, // You can use a different icon if you want
  };

  // Insert Profile as the last item in the menu for all roles
  if (Array.isArray(menuItems[userRole?.toLowerCase?.()])) {
    if (!menuItems[userRole?.toLowerCase?.()].some(item => item.id === 'profile')) {
      menuItems[userRole?.toLowerCase?.()].push(profileMenuItem);
    }
  }
  // For simpleMenu (fallback)
  if (!simpleMenu.some(item => item.id === 'profile')) {
    simpleMenu.push(profileMenuItem);
  }

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
      navigate(`/${itemId}`);
      if (isMobile) {
        onToggleSidebar();
      }
    }
  };

  const handleSubItemClick = (itemId) => {
    navigate(`/${itemId}`);
    if (isMobile) {
      onToggleSidebar();
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
      onSetHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isOpen) {


      const timeout = setTimeout(() => {
        onSetHovered(false);

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
        <div className="sidebar-overlay" onClick={onToggleSidebar}></div>
      )}

      <div
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'sidebar-mobile' : ''} ${isHovered ? 'sidebar-hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={() => {
          // Keep hover state active when moving within sidebar
          if (!isMobile && !isOpen && !isHovered) {
            onSetHovered(true);
          }
        }}
      >
        <div className="sidebar-header">
          <div className="logo-container">
            <FaUtensils className="logo-icon" />
            {shouldShowExpanded && <span className="logo-text">RestaurantPro</span>}
          </div>
          {isMobile && (
            <button className="sidebar-close-btn" onClick={onToggleSidebar}>
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
                    {item.subItems
                      .filter((subItem) => !subItem.hidden)
                      .map((subItem) => (
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    dispatch(logoutUser());
  }
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
          {/* <button className="nav-btn notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button> */}

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
                <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}><FaUser /> Profile</Link>

                <hr className="dropdown-divider" />
                <a href="#" className="dropdown-item logout" onClick={handleLogout}><FaSignOutAlt /> Logout</a>
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
const ContentRouter = ({ setActiveItem, userRole,editingCategoryId }) => {
  return <Outlet />;
};

// Main Component
const RestaurantAdminPanel = () => {
  const getInitialRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        return userObj.userRole || userObj.role || 'Admin';
      } catch {
        return 'Admin';
      }
    }
    return 'Admin';
  };
  const [userRole, setUserRole] = useState(getInitialRole());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorage = () => {
      setUserRole(getInitialRole());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (VALID_ROLES.includes(decoded.role?.toLowerCase())) {
          setUserRole(decoded.role);
        } else {
          console.error("Invalid role in token");
          setUserRole(null);
        }
      } catch (err) {
        console.error("Invalid token", err);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Redirect to the correct default page if at root
    if (location.pathname === '/') {
      if (["admin", "manager"].includes(userRole?.toLowerCase?.())) {
        navigate('/dashboard-overview', { replace: true });
      } else {
        navigate('/leaves-calendar', { replace: true });
      }
    }
  }, [userRole, location.pathname, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
    if (isHovered) setIsHovered(false);
  };

  if (!userRole) {
    return (
      <div className="loading-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className='d_main_admin'>
      <div className={`admin-panel ${!sidebarOpen ? 'sidebar-closed' : ''} ${isMobile ? 'mobile' : ''} ${isHovered && !sidebarOpen && !isMobile ? 'sidebar-hovered' : ''}`}>
        <Sidebar
          userRole={userRole}
          isOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          isMobile={isMobile}
          isHovered={isHovered}
          onSetHovered={setIsHovered}
        />
        <div className="main-layout">
          <Navbar
            userRole={userRole}
            toggleSidebar={toggleSidebar}
            isOpen={sidebarOpen}
            isMobile={isMobile}
          />
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdminPanel;
