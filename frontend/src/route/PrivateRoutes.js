import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RestaurantAdminPanel from '../Component/RestaurantAdminPanel';
import DashboardOverview from '../Container/DashboardOverview';
import EmployeeList from '../Container/EmployeeList';
import AddEmployee from '../Container/AddEmployee';
import EditEmployee from '../Container/EditEmployee';
import CategoryList from '../Container/CategoryList';
import AddCategory from '../Container/AddCategory';
import StockManagement from '../Container/StockManagement';
import AddItems from '../Container/AddItems';
import SupplierList from '../Container/SupplierList';
import AddSupplier from '../Container/AddSupplier';
import EditSupplier from '../Container/EditSupplier';
import HotelOverview from '../Container/HotelOverview';
import AddHO from '../Container/AddHO';
import AddDishes from '../Container/AddDishes';
import AddHoliday from '../Container/AddHoliday';
import Holidaylist from '../Container/Holidaylist';
import EditHolidays from '../Container/EditHolidays';
import PendingLeave from '../Container/PendingLeave';
import ApprovedLeave from '../Container/ApprovedLeave';
import Calender from '../Container/Calender';
import AddLeave from '../Container/AddLeave';
import Profile from '../Container/Profile';
import EditLeave from '../Container/EditLeave';
import { AddCategoryWrapper } from '../Container/AddCategory';

const PrivateRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<RestaurantAdminPanel />}>
                <Route index element={<DashboardOverview />} />
                <Route path="dashboard-overview" element={<DashboardOverview />} />
                <Route path="employees-list" element={<EmployeeList />} />
                <Route path="employees-add" element={<AddEmployee />} />
                <Route path="employees-edit/:id" element={<EditEmployee />} />
                <Route path="category-list" element={<CategoryList />} />
                <Route path="category-add" element={<AddCategory />} />
                <Route path="category-edit/:id" element={<AddCategoryWrapper />} />
                <Route path="inventory-stock" element={<StockManagement />} />
                <Route path="inventory-add" element={<AddItems />} />
                <Route path="supplier-list" element={<SupplierList />} />
                <Route path="supplier-add" element={<AddSupplier />} />
                <Route path="supplier-edit/:id" element={<EditSupplier />} />
                <Route path="hotel-information" element={<HotelOverview />} />
                <Route path="hotel-information-contact" element={<AddHO />} />
                <Route path="add-dish" element={<AddDishes />} />
                <Route path="add-holiday" element={<AddHoliday />} />
                <Route path="holidays-list" element={<Holidaylist />} />
                <Route path="holiday-edit/:id" element={<EditHolidays />} />
                <Route path="leaves-pending" element={<PendingLeave />} />
                <Route path="leaves-approved" element={<ApprovedLeave />} />
                <Route path="leaves-calendar" element={<Calender />} />
                <Route path="leave-add" element={<AddLeave />} />
                <Route path="leave-edit/:id" element={<EditLeave />} />
                <Route path="profile" element={<Profile />} />
            </Route>
        </Routes>
    );
};

export default PrivateRoutes; 