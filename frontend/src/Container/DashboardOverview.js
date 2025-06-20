import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaUtensils, FaChartLine, FaClipboardList, FaBoxes } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './DashboardOverview.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [1200, 1900, 3000, 5000, 2300, 4000],
        borderColor: '#1f2e3d',
        backgroundColor: 'rgba(31, 46, 61, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Over Time',
      },
    },
  };

  const topItemsData = {
    labels: ['Pizza', 'Burger', 'Pasta', 'Salad', 'Drinks'],
    datasets: [
      {
        label: 'Items Sold',
        data: [300, 250, 150, 100, 400],
        backgroundColor: [
          '#1f2e3d',
          '#163b60',
          '#d8e1e9',
          '#eceff3',
          '#007bff',
        ],
      },
    ],
  };

  const topItemsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Selling Items',
      },
    },
  };

  return (
    <Container fluid className="d_dashboard-container">
      <h2 className="d_dashboard-title">Restaurant Dashboard Overview</h2>
      <Row className="d_stats-row">
        <Col md={3} sm={6} className="mb-4">
          <Card className="d_stat-card d_users-card">
            <Card.Body className="d_card-body">
              <FaUsers className="d_card-icon" />
              <div className="d_card-content">
                <Card.Title className="d_card-title">Total Users</Card.Title>
                <Card.Text className="d_card-text">1,234</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-4">
          <Card className="d_stat-card d_orders-card">
            <Card.Body className="d_card-body">
              <FaClipboardList className="d_card-icon" />
              <div className="d_card-content">
                <Card.Title className="d_card-title">New Orders</Card.Title>
                <Card.Text className="d_card-text">56</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-4">
          <Card className="d_stat-card d_sales-card">
            <Card.Body className="d_card-body">
              <FaChartLine className="d_card-icon" />
              <div className="d_card-content">
                <Card.Title className="d_card-title">Total Sales</Card.Title>
                <Card.Text className="d_card-text">$12,345</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-4">
          <Card className="d_stat-card d_stock-card">
            <Card.Body className="d_card-body">
              <FaBoxes className="d_card-icon" />
              <div className="d_card-content">
                <Card.Title className="d_card-title">Stock Alerts</Card.Title>
                <Card.Text className="d_card-text">7</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="d_charts-row">
        <Col md={6} className="mb-4">
          <Card className="d_chart-card">
            <Card.Body>
              <Card.Title className="d_chart-title">Sales Over Time</Card.Title>
              <div className="d_chart-container">
                <Line data={salesData} options={salesOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="d_chart-card">
            <Card.Body>
              <Card.Title className="d_chart-title">Top Selling Items</Card.Title>
              <div className="d_chart-container">
                <Bar data={topItemsData} options={topItemsOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="d_recent-activity-row">
        <Col>
          <Card className="d_activity-card">
            <Card.Body>
              <Card.Title className="d_activity-title">Recent Activity</Card.Title>
              <ul className="d_activity-list">
                <li>Order #1234 placed by John Doe</li>
                <li>New user registered: Jane Smith</li>
                <li>Menu item 'Pizza' updated</li>
                <li>Low stock alert: 'Milk' (5 units left)</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardOverview;