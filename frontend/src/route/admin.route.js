import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../Component/Header';
import Home from '../Container/Home';

function AdminRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/header" element={<Header />} />
        </Routes>
    );
}

export default AdminRoutes;
