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
import DashAnalytics from '../Container/DashAnalytics';
import HotelOverview from '../Container/HotelOverview';
import AddHO from '../Container/AddHO';
import AddDishes from '../Container/AddDishes';
import SupplierList from '../Container/SupplierList';
import AddCategory from '../Container/AddCategory';
import CategoryList from '../Container/CategoryList';
import InventoryReport from '../Container/InventoryReport';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slice/auth.slice';
import EditEmployee from '../Container/EditEmployee';
import { FaCalendarXmark, FaRegCalendarXmark } from 'react-icons/fa6';
import AddHoliday from '../Container/AddHoliday';
import Holidaylist from '../Container/Holidaylist';
import EditHolidays from '../Container/EditHolidays';
import EditSupplier from '../Container/EditSupplier';
import Spinner from '../Spinner';
// import TakeNewOrderForm from './TakeNewOrderForm';

// Sidebar Component
const VALID_ROLES = ["admin", "manager", "supplyer", "saif", "waiter"];
const Sidebar = ({ activeItem, onItemClick, userRole, isOpen, isMobile, isHovered, onToggleSidebar, onSetHovered }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [hoverTimeout, setHoverTimeout] = useState(null);

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
          {
            id: "dashboard-analytics",
            label: "Analytics",
            icon: <FaChartBar />,
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
          {
            id: "inventory-reports",
            label: "Inventory Reports",
            icon: <FaFileAlt />,
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
          { id: "supplier-edit", label: "Edit Supplier", icon: <FaUserEdit />,hidden: true  },
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
      {
        id: "leaves",
        label: "Leave Management",
        icon: <FaCalendarAlt />,
        subItems: [
          {
            id: "leaves-pending",
            label: "Pending Requests",
            icon: <FaClock />,
          },
          {
            id: "leaves-approved",
            label: "Approved Leaves",
            icon: <FaCheck />,
          },
          { id: "leave-add", label: "Add Leaves", icon: <FaCheck /> },
          {
            id: "leaves-calendar",
            label: "Leave Calendar",
            icon: <FaCalendarAlt />,
          },
        ],
      },
      { id: "reports", label: "Reports", icon: <FaChartBar /> },
     
    ],
    manager: [
      { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
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
          {
            id: "inventory-reports",
            label: "Inventory Reports",
            icon: <FaFileAlt />,
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
          { id: "supplier-edit", label: "Edit Supplier", icon: <FaUserEdit />,hidden: true  }

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
      { id: 'leaves', label: 'Leave Approvals', icon: <FaCalendarAlt /> },
    ],
    Chef: [
      { id: 'hotel-information', label: 'Hotel Information', icon: <FaDesktop /> },

      { id: 'ingredients', label: 'Ingredients', icon: <FaUtensils /> },
      { id: 'leave-apply', label: 'Apply Leave', icon: <FaCalendarAlt /> },
    ],
    Waiter: [
      { id: 'hotel-information', label: 'Hotel Information', icon: <FaDesktop /> },
      { id: 'leave-apply', label: 'Apply Leave', icon: <FaCalendarAlt /> },
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
      { id: "reports", label: "Reports", icon: <FaChartBar /> },
    ],
    saif: [
      {
        id: "hotel-information",
        label: "Hotel Information",
        icon: <FaDesktop />,
      },

      { id: "ingredients", label: "Ingredients", icon: <FaUtensils /> },
      { id: "leave-apply", label: "Apply Leave", icon: <FaCalendarAlt /> },
    ],
    waiter: [
      {
        id: "hotel-information",
        label: "Hotel Information",
        icon: <FaDesktop />,
      },

      { id: "leave-apply", label: "Apply Leave", icon: <FaCalendarAlt /> },
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
      { id: "leave-apply", label: "Apply Leave", icon: <FaCalendarAlt /> },
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

  // Ensure Chef's orders are correctly defined with subItems if they weren't already
  // This block is for ensuring the structure matches the new subItems pattern
  if (userRole === 'Chef' && !menuItems.Chef.find(item => item.id === 'orders')?.subItems) {
    menuItems.Chef = menuItems.Chef.map(item => item.id === 'orders' ? { ...item, subItems: [{ id: 'orders-pending', label: 'Pending Orders', icon: <FaClock /> }, { id: 'orders-preparing', label: 'Preparing', icon: <FaUtensils /> }, { id: 'orders-ready', label: 'Ready to Serve', icon: <FaCheck /> }] } : item);
  }

  // Add 'Take New Order' to Waiter's orders sub-menu


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
      onItemClick(itemId);
      if (isMobile) {
        onToggleSidebar();
      }
    }
  };

  const handleSubItemClick = (itemId) => {
    onItemClick(itemId);
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
                <a href="#" className="dropdown-item"><FaUser /> Profile</a>
                <a href="#" className="dropdown-item"><FaCog /> Settings</a>
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
const ContentRouter = ({ activeItem, setActiveItem, userRole, onNavigate, editingCategoryId }) => {
  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
      case 'dashboard-overview':
        return (
          <>
            <DashboardOverview onNavigate={onNavigate} />
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
            <EmployeeList setActiveItem={setActiveItem} />
          </>
        );

      case 'employees-add':
        return (
          <>
            <AddEmployee onNavigate={onNavigate}></AddEmployee>
          </>
        );
      case 'employees-edit':
        return (
          <>
            <EditEmployee></EditEmployee>
          </>
        );
      case 'suppliers':
      case 'supplier-list':
        return (
          <>
            <SupplierList onNavigate={onNavigate}></SupplierList>
          </>
        );
      case 'category-add':
        return (
          <>
            <AddCategory categoryId={editingCategoryId} onNavigate={onNavigate} />
          </>
        );
      case 'category-list':
        return (
          <>
            <CategoryList onNavigate={onNavigate} />
          </>
        );


      case 'orders':
      case 'orders-active':
        return (
          <>
            <ActiveOrder onNavigate={onNavigate}></ActiveOrder>
          </>
        );


      case 'hotel-information-contact':
        return (
          <>
            <AddHO onNavigate={onNavigate}></AddHO>
          </>
        );
      case 'add-dish':
        return (
          <>
            <AddDishes onNavigate={onNavigate}></AddDishes>
          </>
        );
      case 'hotel-information':
        return (
          <>
            <HotelOverview onNavigate={onNavigate}></HotelOverview>
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
            <StockManagement onNavigate={onNavigate}></StockManagement>
          </>
        );

      case 'inventory-add':
        return (
          <>
            <AddItems onNavigate={onNavigate}></AddItems>
          </>
        );
      case 'supplier-add':
        return (
          <>
            <AddSupplier onNavigate={onNavigate}></AddSupplier>
          </>
        )
        case 'supplier-edit':
        return (
          <>
            <EditSupplier supplierId={editingCategoryId} onNavigate={onNavigate} />
          </>
        )
      case 'leave-add':
        return (
          <>
            <AddLeave onNavigate={onNavigate}></AddLeave>
          </>
        )
      case 'inventory-reports':
        return (
          <InventoryReport></InventoryReport>
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
            <Billing onNavigate={onNavigate}></Billing>
          </>
        );
      case 'leaves-approved':
        return (
          <>
            <ApprovedLeave onNavigate={onNavigate}></ApprovedLeave>
          </>
        )

      case 'leaves-calendar':
        return (
          <Calender onNavigate={onNavigate} />
        );
      case 'holidays':
      case 'holidays-list':
        return (
          <>
            <Holidaylist onNavigate={onNavigate}></Holidaylist>
          </>
        )
      case 'add-holiday':
        return (
          <>
            <AddHoliday onNavigate={onNavigate}></AddHoliday>
          </>
        )
      case 'holiday-edit' :
        return (
          <>
            <EditHolidays onNavigate={onNavigate}></EditHolidays>
          </>
        )
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
            <PendingLeave onNavigate={onNavigate}></PendingLeave>
          </>
        );
    }
  };

  return <div className="main-content">{renderContent()}</div>;
};

// Main Component
// const RestaurantAdminPanel = () => {
//   const [activeItem, setActiveItem] = useState(() => localStorage.getItem('activeAdminPanelItem') || 'dashboard');
//   const [userRole, setUserRole] = useState('Admin');
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [editingCategoryId, setEditingCategoryId] = useState(null);

//   const handleNavigate = (view, id = null) => {
//     setActiveItem(view);
//     setEditingCategoryId(id);
//   };

//   useEffect(() => {
//     const checkScreenSize = () => {
//       const mobile = window.innerWidth <= 768;
//       setIsMobile(mobile);
//       if (mobile) {
//         setSidebarOpen(false);
//       } else {
//         setSidebarOpen(true);
//       }
//     };

//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);
//   useEffect(() => {
//     localStorage.setItem('activeAdminPanelItem', activeItem);
//   }, [activeItem]);
//   // Improved toggleSidebar function
//   const toggleSidebar = () => {
//     console.log('Toggle sidebar clicked, current state:', sidebarOpen); // Debug માટે
//     setSidebarOpen(prevState => {
//       const newState = !prevState;
//       console.log('New sidebar state:', newState); // Debug માટે
//       return newState;
//     });

//     // જો sidebar hover state માં છે તેને clear કરો
//     if (isHovered) {
//       setIsHovered(false);
//     }
//   };

//   const handleMenuClick = (component) => {
//     setEditingCategoryId(null); // Reset editing state when changing views
//     setActiveItem(component);
//   };

//   const handleEditCategory = (id) => {
//     setEditingCategoryId(id);
//     setActiveItem('category-add'); // Switch to the form view
//   };

//   return (
//     <div className='d_main_admin'>
//       <div className={`admin-panel  ${!sidebarOpen ? 'sidebar-closed' : ''} ${isMobile ? 'mobile' : ''} ${isHovered && !sidebarOpen && !isMobile ? 'sidebar-hovered' : ''}`}>
//         <Sidebar
//           activeItem={activeItem}
//           onItemClick={handleNavigate}
//           userRole={userRole}
//           isOpen={sidebarOpen}
//           isMobile={isMobile}
//           onToggleSidebar={toggleSidebar}
//           onSetHovered={setIsHovered}
//         />

//         <div className="main-layout">
//           <Navbar
//             userRole={userRole}
//             toggleSidebar={toggleSidebar}
//             isOpen={sidebarOpen}
//             isMobile={isMobile}
//           />

//           <ContentRouter
//             activeItem={activeItem}
//             setActiveItem={setActiveItem}
//             userRole={userRole}
//             onNavigate={handleNavigate}
//             editingCategoryId={editingCategoryId}
//           />
//         </div>

//         <div className="role-switcher-container">
//           <select
//             className="role-switcher"
//             value={userRole}
//             onChange={(e) => setUserRole(e.target.value)}
//           >
//             <option value="Admin">Admin</option>
//             <option value="Manager">Manager</option>
//             <option value="Chef">Chef</option>
//             <option value="Waiter">Waiter</option>
//             <option value="Housekeeping">Housekeeping</option>
//             <option value="Receptionist">Receptionist</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RestaurantAdminPanel;
const RestaurantAdminPanel = () => {
  const [activeItem, setActiveItem] = useState(() => localStorage.getItem('activeAdminPanelItem') || 'dashboard');
  // Always get user role from localStorage
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
  // const [userRole, setUserRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Update userRole if localStorage changes (e.g., after login)
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
        console.log("Decoded token:", decoded);
        
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
    localStorage.setItem('activeAdminPanelItem', activeItem);
  }, [activeItem]);

  // Improved toggleSidebar function
  // const toggleSidebar = () => {
  //   setSidebarOpen(prevState => !prevState);
  //   if (isHovered) {
  //     setIsHovered(false);
  //   }
  // };

  const handleNavigate = (view, id = null) => {
    setActiveItem(view);
    setEditingCategoryId(id);
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
    if (isHovered) setIsHovered(false);
  };

  const handleMenuClick = (component) => {
    setEditingCategoryId(null);
    setActiveItem(component);
  };

  const handleEditCategory = (id) => {
    setEditingCategoryId(id);
    setActiveItem('category-add');
  };

  if (!userRole) {
    return (
      <div className="loading-screen">
         <Spinner></Spinner>
      </div>
    );
  }

  return (
    <div className='d_main_admin'>
      <div className={`admin-panel  ${!sidebarOpen ? 'sidebar-closed' : ''} ${isMobile ? 'mobile' : ''} ${isHovered && !sidebarOpen && !isMobile ? 'sidebar-hovered' : ''}`}>
        <Sidebar
          activeItem={activeItem}
          onItemClick={handleNavigate}
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
            onNavigate={handleNavigate}
            editingCategoryId={editingCategoryId}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdminPanel;
