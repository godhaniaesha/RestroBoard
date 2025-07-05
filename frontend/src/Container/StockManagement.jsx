import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  deleteItem,
  fetchItemById,
} from "../redux/slice/stockmanage.slice";
import AddItems from "./AddItems";
import "../Style/Z_table.css";
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaCaretLeft,
  FaCaretRight,
} from "react-icons/fa";
import DeleteConfirmationModal from "../Component/DeleteConfirmationModal";
import Spinner from "../Spinner";

function StockManagement() {
  const dispatch = useDispatch();
  const { items, loading, error, selectedItem } = useSelector(
    (state) => state.stock
  );
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

  const filteredStock = items.filter(
    (item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase()) ||
      (item.category_id?.category_name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Pagination logic
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
    <section className="Z_SM_section">
      <div className="Z_SM_container">
        <div className="Z_SM_headerRow">
          <h4 className="Z_SM_title">Stock Management</h4>
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
          {loading && <Spinner></Spinner>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {paginatedStock.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <img
                src={require('../Image/hey.jpg')}
                alt="No data"
                className="Z_noDataImage"
              />
              <div
                style={{ color: "#888", marginTop: "1rem", fontSize: "1.1rem" }}
              >
                No stock items found.
              </div>
            </div>
          ) : (
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
                    <td className="Z_SM_Td">
                      {item.category_id?.category_name || ""}
                    </td>
                    <td className="Z_SM_Td">{`${item.quantity} ${item.unit}`}</td>
                    <td className="Z_SM_Td">{`$${item.price?.toFixed(2)}`}</td>
                    <td className="Z_SM_Td">
                      {item.updatedAt ? item.updatedAt.slice(0, 10) : ""}
                    </td>
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
          )}
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
                    className={`Z_pagination_page${currentPage === idx + 1 ? " Z_pagination_active" : ""
                      }`}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))
              ) : (
                <>
                  <button
                    className={`Z_pagination_page${currentPage === 1 ? " Z_pagination_active" : ""
                      }`}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                  {currentPage > 3 && (
                    <span className="Z_pagination_ellipsis">...</span>
                  )}
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
                      className={`Z_pagination_page${currentPage === totalPages - 1
                          ? " Z_pagination_active"
                          : ""
                        }`}
                      onClick={() => handlePageChange(totalPages - 1)}
                    >
                      {totalPages - 1}
                    </button>
                  )}
                  <button
                    className={`Z_pagination_page${currentPage === totalPages ? " Z_pagination_active" : ""
                      }`}
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
  );
}

export default StockManagement;
