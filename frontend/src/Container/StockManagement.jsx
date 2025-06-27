import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, deleteItem } from "../redux/slice/stockmanage.slice";
import "../Style/Z_table.css";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import DeleteConfirmationModal from "../Component/DeleteConfirmationModal";
import Spinner from "../Spinner";

function StockManagement() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.stock);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

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

  const filteredStock = items.filter(
    (item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase()) ||
      (item.category_id?.category_name || "").toLowerCase().includes(search.toLowerCase())
  );

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
          {loading &&  <Spinner></Spinner>}
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
              {filteredStock.map((item, idx) => (
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
                      className={`Z_SM_status Z_SM_status--${
                        item.quantity === 0
                          ? "out-of-stock"
                          : item.quantity <= item.minimum_threshold
                          ? "low-stock"
                          : "in-stock"
                      }`}
                    >
                      {item.quantity === 0
                        ? "Out of Stock"
                        : item.quantity <= item.minimum_threshold
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </td>
                  <td className="Z_SM_Td">
                    <button
                      className="Z_SM_actionBtn Z_SM_actionBtn--edit"
                      title="Edit"
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