import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSuppliers, deleteSupplier } from "../redux/slice/supplier.slice";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import "../Style/Z_table.css";

const ITEMS_PER_PAGE = 5;

function SupplierList({ onNavigate }) {
  const dispatch = useDispatch();
  const { suppliers, loading } = useSelector((state) => state.supplier);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllSuppliers());
  }, [dispatch]);

  const handleEdit = (id) => {
    onNavigate('supplier-edit')
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      dispatch(deleteSupplier(id));
    }
  };

  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

  const totalPages = Math.ceil(safeSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = safeSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="Z_empListSection">
      <div className="Z_empListTableContainer">
        <div className="Z_empList_headerRow">
          <h4 className="Z_empListTitle">Suppliers List</h4>
        </div>
        <div className="Z_empListTableWrapper">
          {loading ? (
            <p className="text-center">Loading suppliers...</p>
          ) : (
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
                  <th className="Z_empListTh">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSuppliers.length > 0 ? (
                  paginatedSuppliers.map((sup, idx) => (
                    <tr className="Z_empListTr" key={idx}>
                      <td className="Z_empListTd">
                        <img
                            src={`http://localhost:3000${sup.supplyer_image}`}
                          alt={sup.name}
                          className="Z_empListPhoto"
                        />
                      </td>
                      <td className="Z_empListTd">{sup.name}</td>
                      <td className="Z_empListTd">{sup.phone}</td>
                      <td className="Z_empListTd">{sup.email}</td>
                      <td className="Z_empListTd">{sup.whatsapp_number}</td>
                      <td className="Z_empListTd">{sup.address}</td>
                      <td className="Z_empListTd">{sup.ingredients_supplied}</td>
                      <td className="Z_empListTd">
                        <button
                          className="Z_empListActionBtn"
                          title="Edit"
                          onClick={() => handleEdit(sup._id)}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="Z_empListActionBtn"
                          title="Delete"
                          onClick={() => handleDelete(sup._id)}
                        >
                          <FaRegTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="Z_empListPagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`Z_empListPageBtn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SupplierList;
