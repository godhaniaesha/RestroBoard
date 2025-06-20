import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaUtensils, FaChartLine, FaClipboardList, FaBoxes } from 'react-icons/fa';
import './DashboardOverview.css'; // We will create this CSS file

const DashboardOverview = () => {
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
          <Card className="d_stat-card d_sales-card"> {/* Changed from d_dishes-card to d_sales-card for consistency */}
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
          <Card className="d_stat-card d_stock-card"> {/* New card for Stock Alerts */}
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
              {/* Placeholder for a chart component */}
              <div className="d_chart-placeholder">Chart will go here</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="d_chart-card">
            <Card.Body>
              <Card.Title className="d_chart-title">Top Selling Items</Card.Title>
              {/* Placeholder for another chart component */}
              <div className="d_chart-placeholder">Another chart will go here</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="d_recent-activity-row">
        <Col>
          <Card className="d_activity-card">
            <Card.Body>
              <Card.Title className="d_activity-title">Recent Activity</Card.Title>
              {/* Placeholder for recent activity list */}
              <ul className="d_activity-list">
                <li>Order #1234 placed by John Doe</li>
                <li>New user registered: Jane Smith</li>
                <li>Menu item 'Pizza' updated</li>
                <li>Low stock alert: 'Milk' (5 units left)</li> {/* Example stock alert */}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardOverview;