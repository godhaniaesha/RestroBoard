import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../Style/Z_table.css";
import { fetchSuppliers, deleteSupplier } from "../redux/slice/supplier.slice";
import { FaRegEdit, FaRegTrashAlt, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import DeleteConfirmationModal from "../Component/DeleteConfirmationModal";

const suppliers = [
  {
    name: "Fresh Farms Ltd.",
    phone: "+1 555-111-2222",
    email: "contact@freshfarms.com",
    whatsapp: "+1 555-111-3333",
    address: "123 Main St, Springfield, USA",
    ingredients: "Tomatoes, Lettuce, Onions",
  },
  {
    name: "Organic Goods",
    phone: "+1 555-222-4444",
    email: "info@organicgoods.com",
    whatsapp: "+1 555-222-5555",
    address: "456 Oak Ave, Metropolis, USA",
    ingredients: "Flour, Olive Oil, Cheese",
  },
  {
    name: "Spice Traders",
    phone: "+1 555-333-6666",
    email: "sales@spicetraders.com",
    whatsapp: "+1 555-333-7777",
    address: "789 Pine Rd, Gotham, USA",
    ingredients: "Spices, Herbs, Salt",
  },
];

function SupplierList({ onNavigate }) {
  const dispatch = useDispatch();
  const { suppliers, loading, error } = useSelector((state) => state.supplier);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleEdit = (id) => {
    onNavigate("supplier-add", id);
  };

  const openDeleteModal = (supplier) => {
    setSupplierToDelete(supplier);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSupplierToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      dispatch(deleteSupplier(supplierToDelete._id));
      closeDeleteModal();
    }
  };

  // Filter suppliers by name, phone, or email
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.phone.toLowerCase().includes(search.toLowerCase()) ||
      (supplier.email &&
        supplier.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <section className="Z_empListSection">
        <div className="Z_empListTableContainer">
          <div className="Z_empList_headerRow">
            <h4 className="Z_empListTitle">Suppliers List</h4>
            <div className="Z_empList_controls">
              <input
                className="Z_empList_searchInput"
                type="text"
                placeholder="Search Supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="Z_empListTableWrapper">
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table className="Z_empListTable">
              <thead>
                <tr>
                  <th className="Z_empListTh">Image</th>
                  <th className="Z_empListTh">Name</th>
                  <th className="Z_empListTh">Phone</th>
                  <th className="Z_empListTh">Email</th>
                  <th className="Z_empListTh">WhatsApp</th>
                  <th className="Z_empListTh">Address</th>
                  <th className="Z_empListTh">Ingredients</th>
                  <th className="Z_empListTh">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSuppliers && paginatedSuppliers.length > 0
                  ? paginatedSuppliers.map((supplier) => (
                      <tr className="Z_empListTr" key={supplier._id}>
                        <td className="Z_empListTd">
                          {supplier.supplyer_image ? (
                            <img
                              src={`http://localhost:3000${supplier.supplyer_image}`}
                              alt={supplier.name}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 6,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </td>
                        <td className="Z_empListTd">{supplier.name}</td>
                        <td className="Z_empListTd">{supplier.phone}</td>
                        <td className="Z_empListTd">{supplier.email}</td>
                        <td className="Z_empListTd">
                          {supplier.whatsapp_number}
                        </td>
                        <td className="Z_empListTd">{supplier.address}</td>
                        <td className="Z_empListTd">
                          {Array.isArray(supplier.ingredients_supplied)
                            ? supplier.ingredients_supplied.join(", ")
                            : supplier.ingredients_supplied}
                        </td>
                        <td className="Z_SM_Td">
                          <button
                            className="Z_SM_actionBtn Z_SM_actionBtn--edit"
                            title="Edit"
                            onClick={() => handleEdit(supplier._id)}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="Z_SM_actionBtn Z_SM_actionBtn--delete"
                            title="Delete"
                            onClick={() => openDeleteModal(supplier)}
                          >
                            <FaRegTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  : !loading && (
                      <tr>
                        <td colSpan="7" className="Z_empListTd_noData">
                          No suppliers found.
                        </td>
                      </tr>
                    )}
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
      </section>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={supplierToDelete ? supplierToDelete.name : ""}
      />
    </>
  );
}

export default SupplierList;
