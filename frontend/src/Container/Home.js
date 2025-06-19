import React, { useState } from 'react';
import Sidebar from '../Component/Sidebar';
import Header from '../Component/Header';
import '../Style/d_Style.css';

function Home(props) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const userRole = 'admin'; // This should come from auth state

    return (
        <div>
            <Header userRole={userRole} onLogout={() => alert('Logout')} />
            <Sidebar userRole={userRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="d_mainContent">
                <button className="btn btn-primary d-lg-none mb-3" onClick={() => setSidebarOpen(true)}>
                    Open Menu
                </button>
                <h1>Home</h1>
                <p>Welcome to the RestroBoard Admin Panel!</p>
            </main>
        </div>
    );
}

export default Home;