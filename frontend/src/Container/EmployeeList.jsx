import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployee, deleteEmployee } from "../redux/slice/user.slice";
import "../Style/Z_table.css";
// import { FaRegEdit, FaRegTrashAlt, FaChevronDown } from "react-icons/fa";
import Spinner from "../Spinner";
import { FaRegEdit, FaRegTrashAlt, FaChevronDown, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import DeleteConfirmationModal from "../Component/DeleteConfirmationModal";
import AddEmployee from "./AddEmployee";

function EmployeeList({ setActiveItem }) {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getAllEmployee());
  }, [dispatch]);

  const safeEmployees = Array.isArray(employees) ? employees : [];

  const roles = ["All Roles", ...new Set(safeEmployees.map((e) => e.role))];

  const filtered = safeEmployees.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.role?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone?.toLowerCase().includes(search.toLowerCase()) ||
      emp.joining_date?.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      role === "" || role === "All Roles" || emp.role === role;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedEmployees = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (id) => {
    setEditingEmployeeId(id);
  };

  const handleCancelEdit = () => {
    setEditingEmployeeId(null);
  };

  const handleSuccess = () => {
    setEditingEmployeeId(null);
    dispatch(getAllEmployee());
  };

  const openDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEmployeeToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      dispatch(deleteEmployee(employeeToDelete._id)).then(() => {
        dispatch(getAllEmployee());
      });
      closeDeleteModal();
    }
  };

  if (editingEmployeeId) {
    return (
      <AddEmployee
        employeeId={editingEmployeeId}
        onSuccess={handleSuccess}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <>
      <section className="Z_empListSection">
        <div className="Z_empListTableContainer">
          <div className="Z_empList_headerRow">
            <h4 className="Z_empListTitle">Employees List</h4>
            <div className="Z_empList_controls">
              <div>
                <input
                  className="Z_empList_searchInput"
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="Z_empList_dropdownWrapper" ref={dropdownRef}>
                <button
                  className="Z_empList_roleDropdown"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{role || "All Roles"}</span>
                  <FaChevronDown
                    className={`Z_empList_dropdownIcon ${isDropdownOpen ? "open" : ""
                      }`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="Z_empList_dropdownMenu">
                    {roles.map((r) => (
                      <div
                        key={r}
                        className="Z_empList_dropdownItem"
                        onClick={() => {
                          setRole(r === "All Roles" ? "" : r);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="Z_empListTableWrapper">
            {loading ? (
              <Spinner></Spinner>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <>
                <table className="Z_empListTable">
                  <thead>
                    <tr>
                      <th className="Z_empListTh">Photo</th>
                      <th className="Z_empListTh">Name</th>
                      <th className="Z_empListTh">Role</th>
                      <th className="Z_empListTh">Email</th>
                      <th className="Z_empListTh">Phone</th>
                      <th className="Z_empListTh">Joining Date</th>
                      <th className="Z_empListTh">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.length > 0 ? (
                      paginatedEmployees.map((emp, idx) => (
                        <tr className="Z_empListTr" key={idx}>
                          <td className="Z_empListTd">
                            <img
                              src={`http://localhost:3000${emp.image}`}
                              alt={emp.name}
                              className="Z_empListPhoto"
                            />
                          </td>
                          <td className="Z_empListTd">
                            {emp.firstName} {emp.lastName}
                          </td>
                          <td className="Z_empListTd">{emp.role}</td>
                          <td className="Z_empListTd">{emp.email}</td>
                          <td className="Z_empListTd">{emp.phone}</td>
                          <td className="Z_empListTd">{emp.joining_Date ? new Date(emp.joining_Date).toLocaleDateString() : emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : ""}</td>
                          <td className="Z_empListTd">
                            <button
                              className="Z_empListActionBtn"
                              title="Edit"
                              onClick={() => handleEdit(emp._id)}
                            >
                              <FaRegEdit />
                            </button>
                            <button
                              className="Z_empListActionBtn"
                              title="Delete"
                              onClick={() => openDeleteModal(emp)}
                            >
                              <FaRegTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="Z_empListNoDataContainer">
                          <div style={{ textAlign: "center", padding: "2rem 0" }}>
                            <img
                              src={require('../Image/hey.jpg')}
                              alt="No data"
                              className="Z_noDataImage"
                            />
                            {/* <div style={{ color: "#888", marginTop: "1rem", fontSize: "1.1rem" }}>
                              No employees found.
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
              </>
            )}
          </div>
        </div>
      </section>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={employeeToDelete ? `${employeeToDelete.firstName} ${employeeToDelete.lastName}` : ""}
      />
    </>
  );
}

export default EmployeeList;
