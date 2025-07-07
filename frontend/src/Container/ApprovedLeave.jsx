import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  db_getLeavesByUserId,
  db_getAllLeaves,
} from "../redux/slice/leave.slice";
import { getRegisterById } from "../redux/slice/user.slice";
import { jwtDecode } from "jwt-decode";
import "../Style/Z_table.css";
import { FaCaretLeft, FaCaretRight, FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ApprovedLeave() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  let userRole = "";
  let userIdFromToken = "";

  try {
    const decoded = jwtDecode(token);
    userRole = decoded?.role || "";
    userIdFromToken = decoded?._id || "";
  } catch (err) {
    console.error("Token decode error:", err);
  }

  const isAdminOrManager = userRole === "admin" || userRole === "manager";

  const leaves = useSelector((state) =>
    isAdminOrManager ? state.leave.leaves : state.leave.userLeaves
  );
  const { loading } = useSelector((state) => state.leave);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [approverNames, setApproverNames] = useState({});
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const itemsPerPage = 5;

  const fetchLeaves = () => {
    if (isAdminOrManager) {
      dispatch(db_getAllLeaves());
    } else if (userId) {
      dispatch(db_getLeavesByUserId(userId));
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [dispatch, userId, isAdminOrManager]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchLeaves();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  // Optional: Refresh leaves every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaves();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const uniqueApproverIds = [
      ...new Set(
        (leaves || [])
          .map((leave) => leave.approvedBy)
          .filter((id) => id && id !== "null")
      ),
    ];

    const fetchApproverNames = async () => {
      const names = {};
      for (const id of uniqueApproverIds) {
        try {
          const result = await dispatch(getRegisterById(id)).unwrap();
          names[id] = `${result.firstName || ""} ${result.lastName || ""}`.trim();
        } catch (error) {
          names[id] = "Unknown";
        }
      }
      setApproverNames(names);
    };

    if (uniqueApproverIds.length > 0) {
      fetchApproverNames();
    }
  }, [leaves, dispatch]);

  const searchText = (search || "").toLowerCase();

  const filteredLeaves = (leaves || []).filter(
    (leave) =>
      (leave.emp_name || "").toLowerCase().includes(searchText) ||
      (leave.leave_type || "").toLowerCase().includes(searchText) ||
      (approverNames[leave.approvedBy] || "")
        .toLowerCase()
        .includes(searchText) ||
      (leave.leave_status || "").toLowerCase().includes(searchText)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedLeaves = filteredLeaves.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="Z_AL_section">
      <div className="Z_AL_container">
        <div className="Z_AL_headerRow">
          <h4 className="Z_AL_title">
            {isAdminOrManager ? "All Leave History" : "Your Leave History"}
          </h4>
          <div className="Z_AL_controls">
            <input
              className="Z_AL_searchInput"
              type="text"
              placeholder="Search Leaves..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="Z_AL_loading">Loading...</div>
        ) : (
          <div className="Z_AL_tableWrapper">
            <table className="Z_AL_table">
              <thead>
                <tr>
                  {isAdminOrManager && <th className="Z_AL_Th">Employee</th>}
                  <th className="Z_AL_Th">Leave Type</th>
                  <th className="Z_AL_Th">Dates</th>
                  <th className="Z_AL_Th">Times</th>
                  <th className="Z_AL_Th">Reason</th>
                  <th className="Z_AL_Th">Updated By</th>
                  <th className="Z_AL_Th">Status</th>
                  {isAdminOrManager && <th className="Z_AL_Th">Action</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedLeaves.length > 0 ? (
                  paginatedLeaves.map((leave, idx) => {
                    const isOwnLeave = leave.userId === userIdFromToken;
                    const isEditDisabled =
                      leave.leave_status === "cancelled" ||
                      (userRole === "manager" && isOwnLeave);

                    return (
                      <tr className="Z_AL_Tr" key={idx}>
                        {isAdminOrManager && (
                          <td className="Z_AL_Td">
                            <div className="Z_AL_empCell">
                              <img
                                src={
                                  leave.photo || "https://via.placeholder.com/40"
                                }
                                alt={leave.emp_name}
                                className="Z_AL_photo"
                              />
                              <span>{leave.emp_name || "N/A"}</span>
                            </div>
                          </td>
                        )}
                        <td className="Z_AL_Td">{leave.leave_type || "N/A"}</td>
                        <td className="Z_AL_Td">
                          {`${leave.start_date?.slice(0, 10) || "-"} to ${
                            leave.end_date?.slice(0, 10) || "-"
                          }`}
                        </td>
                        <td className="Z_AL_Td">
                          {`${leave.start_time || "-"} to ${leave.end_time || "-"}`}
                        </td>
                        <td className="Z_AL_Td">{leave.leave_reason || "N/A"}</td>
                        <td className="Z_AL_Td">
                          {approverNames[leave.approvedBy] || "Not updated"}
                        </td>
                       <td className="Z_AL_Td">
  <span
    className={`Z_AL_status Z_AL_status--${(leave.leave_status || "pending").toLowerCase()}`}
  >
    {leave.leave_status || "Pending"}
  </span>
</td>
                        {isAdminOrManager && (
                          <td className="Z_AL_Td">
                            <button
                              className="Z_AL_actionBtn Z_AL_actionBtn--edit me-2"
                              title={
                                leave.leave_status === "cancelled"
                                  ? "Edit Disabled (Cancelled Leave)"
                                  : userRole === "manager" && isOwnLeave
                                  ? "Edit Disabled (Own Leave)"
                                  : "Edit"
                              }
                              onClick={() => {
                                if (!isEditDisabled) {
                                  localStorage.setItem("editleaveid", leave._id);
                                  navigate(`/leave-edit/${leave._id}`);
                                  setShouldRefresh(true); // trigger refresh on return
                                }
                              }}
                              disabled={isEditDisabled}
                              style={{
                                cursor: isEditDisabled ? "not-allowed" : "pointer",
                                opacity: isEditDisabled ? 0.5 : 1,
                              }}
                            >
                              <FaRegEdit />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                  <td colSpan="12" className="Z_empListNoDataContainer">
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

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`Z_pagination_page${
                    currentPage === idx + 1 ? " Z_pagination_active" : ""
                  }`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}

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
        )}
      </div>
    </section>
  );
}

export default ApprovedLeave;
