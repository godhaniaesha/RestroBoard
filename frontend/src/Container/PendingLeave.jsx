import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../Style/Z_table.css";
import {
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaRegTrashAlt,
  FaCaretLeft,
  FaCaretRight,
} from "react-icons/fa";
import { db_getLeavesByUserId } from "../redux/slice/leave.slice"; // Assuming this path

function PendingLeave() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Assuming user info is in state.auth
  const { leaves, isLoading, isError, message } = useSelector((state) => state.leave); // Assuming leave state has leaves, isLoading, isError, message

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch leaves when component mounts or user changes
  useEffect(() => {
    if (user && user.id) { // Ensure user and user.id exist
      dispatch(db_getLeavesByUserId(user.id));
    }
  }, [user, dispatch]); // Depend on user and dispatch

  // Use the leaves from Redux state, or an empty array if not loaded yet
  const currentLeaves = leaves || [];

  const filteredLeaves = currentLeaves.filter((leave) =>
    (leave?.emp_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (leave?.leave_type || "").toLowerCase().includes(search.toLowerCase()) ||
    (leave?.leave_reason || "").toLowerCase().includes(search.toLowerCase())
  );
  

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedLeaves = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <div>Loading leaves...</div>; // Basic loading indicator
  }

  if (isError) {
    return <div>Error: {message}</div>; // Basic error display
  }

  return (
    <section className="Z_LP_section">
      <div className="Z_LP_container">
        <div className="Z_LP_headerRow">
          <h4 className="Z_LP_title">Pending Leave Requests</h4>
          <div className="Z_LP_controls">
            <input
              className="Z_LP_searchInput"
              type="text"
              placeholder="Search Leaves..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="Z_LP_tableWrapper">
          <table className="Z_LP_table">
            <thead>
              <tr>
                <th className="Z_LP_Th">Employee</th>
                <th className="Z_LP_Th">Leave Type</th>
                <th className="Z_LP_Th">Dates</th>
                <th className="Z_LP_Th">Reason</th>
                <th className="Z_LP_Th">Status</th>
                <th className="Z_LP_Th">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeaves.length > 0 ? (
                paginatedLeaves.map((leave, idx) => (
                  <tr className="Z_LP_Tr" key={idx}>
                    <td className="Z_LP_Td">
                      <div className="Z_LP_empCell">
                        <img
                          src={leave.photo_url}
                          alt={leave.name}
                          className="Z_LP_photo"
                        />
                        <span>{leave.name}</span>
                      </div>
                    </td>
                    <td className="Z_LP_Td">{leave.leave_type}</td>
                    <td className="Z_LP_Td">{`${leave.start_date} to ${leave.end_date}`}</td>
                    <td className="Z_LP_Td">{leave.reason}</td>
                    <td className="Z_LP_Td">
                      <span
                        className={`Z_LP_status Z_LP_status--${leave.status.toLowerCase()}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="Z_LP_Td">
                      <button
                        className="Z_LP_actionBtn Z_LP_actionBtn--approve"
                        title="Approve"
                      >
                        <FaRegCheckCircle />
                      </button>
                      <button
                        className="Z_LP_actionBtn Z_LP_actionBtn--reject"
                        title="Reject"
                      >
                        <FaRegTimesCircle />
                      </button>
                      <button
                        className="Z_LP_actionBtn Z_LP_actionBtn--delete"
                        title="Delete"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                      <td colSpan="6" className="Z_empListNoDataContainer">
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
  );
}

export default PendingLeave;