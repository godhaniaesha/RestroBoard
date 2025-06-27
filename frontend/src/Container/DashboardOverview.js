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

const COLORS = ['#4E6688', '#748DA6', '#9BB8CD', '#7F8CAA', '#A6AEBF'];

const recentOrders = [
  { id: '#1234', customer: 'John Doe', time: '10:30 AM', items: 3, total: 45.00, status: 'Completed' },
  { id: '#1235', customer: 'Jane Smith', time: '10:35 AM', items: 1, total: 15.50, status: 'Completed' },
  { id: '#1236', customer: 'Mike Johnson', time: '10:40 AM', items: 5, total: 72.25, status: 'Pending' },
  { id: '#1237', customer: 'Emily Williams', time: '10:42 AM', items: 2, total: 25.00, status: 'Completed' },
  { id: '#1238', customer: 'Chris Brown', time: '10:50 AM', items: 4, total: 55.75, status: 'Cancelled' },
];




export default function DashboardOverview() {

  const dispatch = useDispatch();
  const { items, loading, error, selectedItem } = useSelector((state) => state.stock);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  // Fetch item details when editItemId changes
  useEffect(() => {
    if (editItemId) {
      dispatch(fetchItemById(editItemId));
    }
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
      dispatch(deleteItem(itemToDelete._id));
      closeDeleteModal();
    }
  };

  const handleEdit = (id) => {
    setEditItemId(id);
  };

  const handleFormSuccess = () => {
    setEditItemId(null);
    dispatch(fetchItems());
  };

  // Filter for only Out of Stock and Low Stock items
  const filteredStock = items.filter(
    (item) => {
      const quantity = Number(item.quantity);
      return (
        quantity === 0 || quantity <= item.minimum_threshold
      ) && (
        item.item_name.toLowerCase().includes(search.toLowerCase()) ||
        (item.category_id?.category_name || "").toLowerCase().includes(search.toLowerCase())
      );
    }
  );

  // Calculate paginated data
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
        editItem={selectedItem}
        onSuccess={handleFormSuccess}
        onCancel={() => setEditItemId(null)}
      />
    );
  }
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
          <section>
            <div className="Z_SM_container">
              <div className="Z_SM_headerRow">
                <h4 className="Z_SM_title mb-0">Stock Management</h4>
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
                    {paginatedStock.map((item, idx) => (
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
                    ))}
                  </tbody>
                </table>
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
