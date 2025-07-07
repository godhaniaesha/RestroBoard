import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom"; // No longer needed for this
import "../Style/Z_table.css";
import { fetchCategories, deleteCategory } from "../redux/slice/category.slice";
import { FaRegEdit, FaRegTrashAlt, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import DeleteConfirmationModal from "../Component/DeleteConfirmationModal";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

function CategoryList() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // No longer needed
  const { categories, loading, error } = useSelector((state) => state.category);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (id) => {
    // localStorage.setItem("categoryId", id);
    navigate(`/category-edit/${id}`);
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete._id));
      closeDeleteModal();
    }
  };

  // Filter categories by name or description
  const filteredCategories = categories.filter(
    (cat) =>
      cat.category_name.toLowerCase().includes(search.toLowerCase()) ||
      cat.category_description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <section className="Z_empListSection">
        <div className="Z_empListTableContainer">
          <div className="Z_empList_headerRow">
            <h4 className="Z_empListTitle">Category List</h4>
            <div className="Z_empList_controls">
              <input
                className="Z_empList_searchInput"
                type="text"
                placeholder="Search Category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="Z_empListTableWrapper">
            {loading &&  <Spinner></Spinner>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table className="Z_empListTable">
              <thead>
                <tr>
                  <th className="Z_empListTh">Image</th>
                  <th className="Z_empListTh">Name</th>
                  <th className="Z_empListTh">Description</th>
                  <th className="Z_empListTh">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories && paginatedCategories.length > 0
                  ? paginatedCategories.map((cat) => (
                      <tr className="Z_empListTr" key={cat._id}>
                        <td className="Z_empListTd">
                          {cat.category_image ? (
                            <img
                              // ${IMG_URL}${category.image}
                              src={`http://localhost:3000${cat.category_image}`}
                              alt={cat.category_name}
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
                        <td
                          className="Z_empListTd"
                          
                        >
                          {cat.category_name}
                        </td>
                        <td className="Z_empListTd">
                          {cat.category_description}
                        </td>
                        <td className="Z_SM_Td">
                          <button
                            className="Z_SM_actionBtn Z_SM_actionBtn--edit"
                            title="Edit"
                            onClick={() => handleEdit(cat._id)}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="Z_SM_actionBtn Z_SM_actionBtn--delete"
                            title="Delete"
                            onClick={() => openDeleteModal(cat)}
                          >
                            <FaRegTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  : !loading && (
                    <tr>
                      <td colSpan="4" className="Z_empListNoDataContainer">
                        <div style={{ textAlign: "center", padding: "2rem 0" }}>
                          <img
                            src={require('../Image/hey.jpg')}
                            alt="No data"
                            className="Z_noDataImage"
                          />
                          {/* <div style={{ color: "#888", marginTop: "1rem", fontSize: "1.1rem" }}>
                            No categories found.
                          </div> */}
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
      </section>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={categoryToDelete ? categoryToDelete.category_name : ""}
      />
    </>
  );
}

export default CategoryList;
