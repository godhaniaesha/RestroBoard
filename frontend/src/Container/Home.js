import React, { useState } from 'react';
import '../Style/d_Style.css';

function Home(props) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const userRole = 'admin'; // This should come from auth state

    return (
        <div>
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