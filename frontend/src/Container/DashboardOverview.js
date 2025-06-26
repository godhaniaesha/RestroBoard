import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { FaDollarSign, FaShoppingCart, FaUsers, FaClock } from 'react-icons/fa';
import './DashboardOverview.css';
import "../Style/Z_table.css";

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 4500 },
  { name: 'Fri', sales: 6000 },
  { name: 'Sat', sales: 8000 },
  { name: 'Sun', sales: 7500 },
];

const topProducts = [
  { name: 'Margherita Pizza', sold: 120, revenue: 1200 },
  { name: 'Cheeseburger', sold: 90, revenue: 990 },
  { name: 'Caesar Salad', sold: 70, revenue: 770 },
  { name: 'Pasta Carbonara', sold: 110, revenue: 1430 },
  { name: 'Chocolate Cake', sold: 50, revenue: 350 },
];

const COLORS = ['#4E6688',  '#748DA6', '#9BB8CD','#7F8CAA', '#A6AEBF'];

const recentOrders = [
  { id: '#1234', customer: 'John Doe', time: '10:30 AM', items: 3, total: 45.00, status: 'Completed' },
  { id: '#1235', customer: 'Jane Smith', time: '10:35 AM', items: 1, total: 15.50, status: 'Completed' },
  { id: '#1236', customer: 'Mike Johnson', time: '10:40 AM', items: 5, total: 72.25, status: 'Pending' },
  { id: '#1237', customer: 'Emily Williams', time: '10:42 AM', items: 2, total: 25.00, status: 'Completed' },
  { id: '#1238', customer: 'Chris Brown', time: '10:50 AM', items: 4, total: 55.75, status: 'Cancelled' },
];

export default function DashboardOverview() {
  return (
    <Container fluid className="d_dashboard_overview">
      <h2 className="d_dashboard_title">Dashboard Overview</h2>

      <Row>
        <Col md={3} lg={3}>
          <Card className="d_summary_card d_card_revenue">
            <Card.Body>
              <div className="d_card_icon">
                <FaDollarSign />
              </div>
              <div>
                <Card.Title>Today's Revenue</Card.Title>
                <Card.Text>$1,250</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} lg={3}>
          <Card className="d_summary_card d_card_orders">
            <Card.Body>
              <div className="d_card_icon">
                <FaShoppingCart />
              </div>
              <div>
                <Card.Title>Total Orders</Card.Title>
                <Card.Text>150</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} lg={3}>
          <Card className="d_summary_card d_card_customers">
            <Card.Body>
              <div className="d_card_icon">
                <FaUsers />
              </div>
              <div>
                <Card.Title>New Customers</Card.Title>
                <Card.Text>35</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} lg={3}>
          <Card className="d_summary_card d_card_pending">
            <Card.Body>
              <div className="d_card_icon">
                <FaClock />
              </div>
              <div>
                <Card.Title>Pending Deliveries</Card.Title>
                <Card.Text>12</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={7} md={12} className="mb-4">
          <Card className="d_chart_card">
            <Card.Body>
              <Card.Title>Weekly Sales</Card.Title>
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
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5} md={12} className="mb-4">
          <Card className="d_products_card">
            <Card.Body>
              <Card.Title>Top Selling Products</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="sold"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="Z_ov_dash_container">
            <div className="Z_ov_dash_headerRow">
              <h4 className="Z_ov_dash_title">Recent Orders</h4>
            </div>
            <div className="Z_ov_dash_tableWrapper">
              <table className="Z_ov_dash_table">
                <thead>
                  <tr>
                    <th className="Z_ov_dash_Th">Order ID</th>
                    <th className="Z_ov_dash_Th">Customer</th>
                    <th className="Z_ov_dash_Th">Time</th>
                    <th className="Z_ov_dash_Th">Items</th>
                    <th className="Z_ov_dash_Th">Total</th>
                    <th className="Z_ov_dash_Th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr className="Z_ov_dash_Tr" key={order.id}>
                      <td className="Z_ov_dash_Td">{order.id}</td>
                      <td className="Z_ov_dash_Td">{order.customer}</td>
                      <td className="Z_ov_dash_Td">{order.time}</td>
                      <td className="Z_ov_dash_Td">{order.items}</td>
                      <td className="Z_ov_dash_Td">${order.total.toFixed(2)}</td>
                      <td className="Z_ov_dash_Td">
                        <span className={`Z_ov_dash_status Z_ov_dash_status--${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
