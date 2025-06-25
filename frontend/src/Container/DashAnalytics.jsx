import React from 'react';
import { FaChartBar, FaShoppingCart, FaDollarSign, FaUserPlus } from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Import salesData from DashboardOverview.js
const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 4500 },
  { name: 'Fri', sales: 6000 },
  { name: 'Sat', sales: 8000 },
  { name: 'Sun', sales: 7500 },
];


function DashAnalytics(props) {
    // Placeholder data
    const summaryData = [
        { title: 'Total Revenue', value: '$45,231.89', icon: <FaDollarSign />, color: '#28a745' },
        { title: 'Total Orders', value: '12,543', icon: <FaShoppingCart />, color: '#17a2b8' },
        { title: 'Average Order Value', value: '$36.06', icon: <FaChartBar />, color: '#ffc107' },
        { title: 'New Customers', value: '852', icon: <FaUserPlus />, color: '#dc3545' }
    ];

    const topProducts = [
        { id: 1, name: 'Margherita Pizza', sales: 1200 },
        { id: 2, name: 'Cheeseburger', sales: 950 },
        { id: 3, name: 'Caesar Salad', sales: 800 },
        { id: 4, name: 'Spaghetti Carbonara', sales: 750 },
        { id: 5, name: 'Chocolate Lava Cake', sales: 600 }
    ];
    
    return (
        <section className="Z_DashAnstic_section">
            <div className="Z_DashAnstic_container">
                <h2 className="Z_DashAnstic_title">Dashboard Analytics</h2>
                
                {/* Summary Cards */}
                <div className="Z_DashAnstic_summaryCards">
                    {summaryData.map(item => (
                        <div key={item.title} className="Z_DashAnstic_card">
                            <div className="Z_DashAnstic_cardIcon" style={{ backgroundColor: item.color }}>
                                {item.icon}
                            </div>
                            <div className="Z_DashAnstic_cardInfo">
                                <h3 className="Z_DashAnstic_cardTitle">{item.title}</h3>
                                <p className="Z_DashAnstic_cardValue">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="Z_DashAnstic_content">
                    {/* Sales Chart */}
                   <div className="Z_DashAnstic_chartContainer">
                        <h3 className="Z_DashAnstic_chartTitle">Sales Overview</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#456268" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Products Table */}
                    <div className="Z_DashAnstic_tableContainer w-100 overflow-x-auto">
                        <h3 className="Z_DashAnstic_tableTitle">Top Selling Products</h3>
                        <div className="Z_DashAnstic_tableWrapper">
                            <table className="Z_DashAnstic_table">
                                <thead>
                                    <tr>
                                        <th className="Z_DashAnstic_Th">Rank</th>
                                        <th className="Z_DashAnstic_Th">Product</th>
                                        <th className="Z_DashAnstic_Th">Total Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((product, index) => (
                                        <tr key={product.id}>
                                            <td className="Z_DashAnstic_Td">{index + 1}</td>
                                            <td className="Z_DashAnstic_Td">{product.name}</td>
                                            <td className="Z_DashAnstic_Td">${product.sales.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DashAnalytics;