import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { FaDollarSign, FaShoppingCart, FaUsers, FaClock, FaRegEdit, FaRegTrashAlt, FaCaretRight, FaCaretLeft } from 'react-icons/fa';
import './DashboardOverview.css';
import "../Style/Z_table.css";
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, fetchItemById, fetchItems } from '../redux/slice/stockmanage.slice';
import AddItems from './AddItems';
import DeleteConfirmationModal from '../Component/DeleteConfirmationModal';
import { getTotalExpense, getEmployeeCounts, getSupplierCount, getTotalItems, getTopSellingProducts, getWeeklyItemAdditions, getLowStockItems, getOutOfStockItems } from '../redux/slice/dashboard.slice';

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 4500 },
  { name: 'Fri', sales: 6000 },
  { name: 'Sat', sales: 8000 },
  { name: 'Sun', sales: 7500 },
];

const COLORS = ['#4E6688', '#748DA6', '#9BB8CD', '#7F8CAA', '#A6AEBF'];

const recentOrders = [
  { id: '#1234', customer: 'John Doe', time: '10:30 AM', items: 3, total: 45.00, status: 'Completed' },
  { id: '#1235', customer: 'Jane Smith', time: '10:35 AM', items: 1, total: 15.50, status: 'Completed' },
  { id: '#1236', customer: 'Mike Johnson', time: '10:40 AM', items: 5, total: 72.25, status: 'Pending' },
  { id: '#1237', customer: 'Emily Williams', time: '10:42 AM', items: 2, total: 25.00, status: 'Completed' },
  { id: '#1238', customer: 'Chris Brown', time: '10:50 AM', items: 4, total: 55.75, status: 'Cancelled' },
];

// Custom Tooltip for Pie Chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const name = entry.name || entry.payload.name || entry.payload._id;
    const percent = entry.percent ? (entry.percent * 100).toFixed(0) : null;
    return (
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: 8, borderRadius: 4 }}>
        <span style={{ fontWeight: 600 }}>{name}</span>
        {percent !== null && <span style={{ marginLeft: 8 }}>{percent}%</span>}
      </div>
    );
  }
  return null;
};

export default function DashboardOverview() {

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.stock);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dashboard = useSelector((state) => state.dashboard);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(getTotalExpense());
    dispatch(getEmployeeCounts());
    dispatch(getSupplierCount());
    dispatch(getTotalItems());
    dispatch(getTopSellingProducts());
    dispatch(getWeeklyItemAdditions());
    dispatch(getLowStockItems());
    dispatch(getOutOfStockItems());
  }, [dispatch]);

  // Fetch item details when editItemId changes
  useEffect(() => {
  }, [editItemId, dispatch]);

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteItem(itemToDelete._id)).then(() => {
        // Refresh dashboard data after delete
        dispatch(getLowStockItems());
        dispatch(getOutOfStockItems());
      });
      closeDeleteModal();
    }
  };

  const handleEdit = (id) => {
    setEditItemId(id);
  };

  const handleFormSuccess = () => {
    setEditItemId(null);
    // Refresh dashboard data after edit
    dispatch(getLowStockItems());
    dispatch(getOutOfStockItems());
  };

  // Combine low stock and out of stock items from dashboard
  const allStockItems = [
    ...(dashboard.lowStockItems || []),
    ...(dashboard.outOfStockItems || [])
  ];
  // Remove duplicates by _id
  const uniqueStockItems = allStockItems.filter((item, index, self) =>
    index === self.findIndex((t) => t._id === item._id)
  );

  // Filter to show only out of stock and low stock items
  const filteredStockItems = uniqueStockItems.filter(item => {
    const quantity = Number(item.quantity);
    const minThreshold = Number(item.minimum_threshold);
    return quantity === 0 || quantity <= minThreshold;
  });

  // Filter by search
  const filteredStock = filteredStockItems.filter(
    (item) =>
      item.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      (item.category_id?.category_name || "").toLowerCase().includes(search.toLowerCase())
  );
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedStock = filteredStock.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (editItemId) {
    // Show AddItems in edit mode
    return (
      <AddItems
        itemId={editItemId}
        editItem={dashboard.selectedItem}
        onSuccess={handleFormSuccess}
        onCancel={() => setEditItemId(null)}
      />
    );
  }
  return (
    <Container fluid className="d_dashboard_overview">
      <h2 className="d_dashboard_title">Dashboard Overview</h2>

      <div className='Z_Crds'>
        <Row>
          <Col md={3} lg={3}>
            <Card className="d_summary_card d_card_revenue">
              <Card.Body>
                <div className="d_card_icon">
                  <FaDollarSign />
                </div>
                <div>
                  <Card.Title>Today's Revenue</Card.Title>
                  <Card.Text>
                    {dashboard.totalExpense?.totalExpense !== undefined
                      ? `₹${dashboard.totalExpense.totalExpense}`
                      : 'Loading...'}
                  </Card.Text>
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
                  <Card.Title>Total Employees</Card.Title>
                  <Card.Text>
                    {dashboard.employeeCounts?.total !== undefined
                      ? dashboard.employeeCounts.total
                      : 'Loading...'}
                  </Card.Text>
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
                  <Card.Title>Suppliers</Card.Title>
                  <Card.Text>
                    {dashboard.supplierCount?.supplier !== undefined
                      ? dashboard.supplierCount.supplier
                      : 'Loading...'}
                  </Card.Text>
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
                  <Card.Title>Total Items</Card.Title>
                  <Card.Text>
                    {dashboard.totalItems?.totalItem !== undefined
                      ? dashboard.totalItems.totalItem
                      : 'Loading...'}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <Row>
        <Col lg={7} md={12} className="mb-4">
          <Card className="d_chart_card">
            <Card.Body>
              <Card.Title>Weekly Sales</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                {dashboard.weeklyItemAdditions && dashboard.weeklyItemAdditions.length > 0 ? (
                  <LineChart data={dashboard.weeklyItemAdditions} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={dashboard.weeklyItemAdditions[0].day ? "day" : "name"} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={dashboard.weeklyItemAdditions[0].totalSales !== undefined ? "totalSales" : "sales"} stroke="#456268" activeDot={{ r: 8 }} />
                  </LineChart>
                ) : (
                  <div style={{ textAlign: 'center', paddingTop: '100px' }}>Loading...</div>
                )}
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5} md={12} className="mb-4">
          <Card className="d_products_card">
            <Card.Body>
              <Card.Title>Top Selling Products</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                {dashboard.topSellingProducts && dashboard.topSellingProducts.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={dashboard.topSellingProducts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey={dashboard.topSellingProducts[0].sold !== undefined ? "sold" : dashboard.topSellingProducts[0].count !== undefined ? "count" : "value"}
                      nameKey={dashboard.topSellingProducts[0].name ? "name" : "_id"}
                      {...(windowWidth >= 1920 ? {
                        label: ({ name, _id, percent }) => `${name || _id} ${(percent * 100).toFixed(0)}%`
                      } : {})}
                    >
                      {dashboard.topSellingProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </PieChart>
                ) : (
                  <div style={{ textAlign: 'center', paddingTop: '100px' }}>Loading...</div>
                )}
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <section>
            <div className="Z_SM_container">
              <div className="Z_SM_headerRow">
                <h4 className="Z_SM_title mb-0">Low Stock Management</h4>
                <div className="Z_SM_controls">
                  <input
                    className="Z_SM_searchInput"
                    type="text"
                    placeholder="Search Stock..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="Z_SM_tableWrapper">
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <table className="Z_SM_table">
                  <thead>
                    <tr>
                      <th className="Z_SM_Th">Item</th>
                      <th className="Z_SM_Th">Category</th>
                      <th className="Z_SM_Th">Quantity</th>
                      <th className="Z_SM_Th">Price</th>
                      <th className="Z_SM_Th">Last Updated</th>
                      <th className="Z_SM_Th">Status</th>
                      <th className="Z_SM_Th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStock.length > 0 ? (
                      paginatedStock.map((item, idx) => (
                        <tr className="Z_SM_Tr" key={item._id || idx}>
                          <td className="Z_SM_Td">
                            <div className="Z_SM_itemCell">
                              <img
                                src={
                                  item.item_image
                                    ? `http://localhost:3000${item.item_image}`
                                    : "https://via.placeholder.com/40"
                                }
                                alt={item.item_name}
                                className="Z_SM_photo"
                              />
                              <span>{item.item_name}</span>
                            </div>
                          </td>
                          <td className="Z_SM_Td">{item.category_id?.category_name || ""}</td>
                          <td className="Z_SM_Td">{`${item.quantity} ${item.unit}`}</td>
                          <td className="Z_SM_Td">{`$${item.price?.toFixed(2)}`}</td>
                          <td className="Z_SM_Td">{item.updatedAt ? item.updatedAt.slice(0, 10) : ""}</td>
                          <td className="Z_SM_Td">
                            <span
                              className={`Z_SM_status Z_SM_status--${Number(item.quantity) === 0
                                ? "out-of-stock"
                                : Number(item.quantity) <= item.minimum_threshold
                                  ? "low-stock"
                                  : "in-stock"
                                }`}
                            >
                              {Number(item.quantity) === 0
                                ? "Out of Stock"
                                : Number(item.quantity) <= item.minimum_threshold
                                  ? "Low Stock"
                                  : "In Stock"}
                            </span>
                          </td>
                          <td className="Z_SM_Td">
                            <button
                              className="Z_SM_actionBtn Z_SM_actionBtn--edit"
                              title="Edit"
                              onClick={() => handleEdit(item._id)}
                            >
                              <FaRegEdit />
                            </button>
                            <button
                              className="Z_SM_actionBtn Z_SM_actionBtn--delete"
                              title="Delete"
                              onClick={() => openDeleteModal(item)}
                            >
                              <FaRegTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "2rem 0" }}>
                          <div>
                            <img
                              src={require('../Image/hey.jpg')}
                              alt="No data"
                              style={{ width: "150px", height: "150px", marginBottom: "1rem" }}
                            />
                          
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="Z_pagination_container">
                    <button
                      className="Z_pagination_btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaCaretLeft />
                    </button>
                    {totalPages <= 4 ? (
                      [...Array(totalPages)].map((_, idx) => (
                        <button
                          key={idx + 1}
                          className={`Z_pagination_page${currentPage === idx + 1 ? ' Z_pagination_active' : ''}`}
                          onClick={() => handlePageChange(idx + 1)}
                        >
                          {idx + 1}
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          className={`Z_pagination_page${currentPage === 1 ? ' Z_pagination_active' : ''}`}
                          onClick={() => handlePageChange(1)}
                        >1</button>
                        {currentPage > 3 && <span className="Z_pagination_ellipsis">...</span>}
                        {currentPage > 2 && currentPage < totalPages - 1 && (
                          <button
                            className="Z_pagination_page Z_pagination_active"
                            onClick={() => handlePageChange(currentPage)}
                          >
                            {currentPage}
                          </button>
                        )}
                        {currentPage < totalPages - 1 && (
                          <button
                            className={`Z_pagination_page${currentPage === totalPages - 1 ? ' Z_pagination_active' : ''}`}
                            onClick={() => handlePageChange(totalPages - 1)}
                          >
                            {totalPages - 1}
                          </button>
                        )}
                        <button
                          className={`Z_pagination_page${currentPage === totalPages ? ' Z_pagination_active' : ''}`}
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    <button
                      className="Z_pagination_btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <FaCaretRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <DeleteConfirmationModal
              isOpen={isModalOpen}
              onClose={closeDeleteModal}
              onConfirm={confirmDelete}
              itemName={itemToDelete ? itemToDelete.item_name : ""}
            />
          </section>
        </Col>
      </Row>
    </Container>
  )
}
