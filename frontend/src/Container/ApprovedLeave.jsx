import React, { useState } from "react";
import "../Style/Z_table.css";
import { FaRegTrashAlt } from "react-icons/fa";

const approvedLeavesData = [
  {
    photo_url: "https://randomuser.me/api/portraits/women/60.jpg",
    name: "Corey Gouse",
    leave_type: "Annual Leave",
    start_date: "2024-06-10",
    end_date: "2024-06-15",
    reason: "Family vacation.",
    status: "Approved",
    approved_by: "Admin",
  },
  {
    photo_url: "https://randomuser.me/api/portraits/men/65.jpg",
    name: "Kian Siphron",
    leave_type: "Sick Leave",
    start_date: "2024-06-20",
    end_date: "2024-06-20",
    reason: "Doctor's appointment.",
    status: "Approved",
    approved_by: "Admin",
  },
  {
    photo_url: "https://randomuser.me/api/portraits/women/62.jpg",
    name: "Adison Herwitz",
    leave_type: "Personal Leave",
    start_date: "2024-06-25",
    end_date: "2024-06-26",
    reason: "Personal matters.",
    status: "Approved",
    approved_by: "Manager",
  },
];

function ApprovedLeave() {
  const [search, setSearch] = useState("");

  const filteredLeaves = approvedLeavesData.filter(
    (leave) =>
      leave.name.toLowerCase().includes(search.toLowerCase()) ||
      leave.leave_type.toLowerCase().includes(search.toLowerCase()) ||
      leave.approved_by.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="Z_AL_section">
      <div className="Z_AL_container">
        <div className="Z_AL_headerRow">
          <h4 className="Z_AL_title">Approved Leave History</h4>
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
        <div className="Z_AL_tableWrapper">
          <table className="Z_AL_table">
            <thead>
              <tr>
                <th className="Z_AL_Th">Employee</th>
                <th className="Z_AL_Th">Leave Type</th>
                <th className="Z_AL_Th">Dates</th>
                <th className="Z_AL_Th">Reason</th>
                <th className="Z_AL_Th">Approved By</th>
                <th className="Z_AL_Th">Status</th>
                <th className="Z_AL_Th">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, idx) => (
                <tr className="Z_AL_Tr" key={idx}>
                  <td className="Z_AL_Td">
                    <div className="Z_AL_empCell">
                      <img
                        src={leave.photo_url}
                        alt={leave.name}
                        className="Z_AL_photo"
                      />
                      <span>{leave.name}</span>
                    </div>
                  </td>
                  <td className="Z_AL_Td">{leave.leave_type}</td>
                  <td className="Z_AL_Td">{`${leave.start_date} to ${leave.end_date}`}</td>
                  <td className="Z_AL_Td">{leave.reason}</td>
                  <td className="Z_AL_Td">{leave.approved_by}</td>
                  <td className="Z_AL_Td">
                    <span
                      className={`Z_AL_status Z_AL_status--${leave.status.toLowerCase()}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="Z_AL_Td">
                    <button
                      className="Z_AL_actionBtn Z_AL_actionBtn--delete"
                      title="Delete"
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
    </section>
  );
}

export default ApprovedLeave;