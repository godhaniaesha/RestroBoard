import React, { useState } from "react";
import "../Style/Z_table.css";
import {
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaRegTrashAlt,
} from "react-icons/fa";

const pendingLeavesData = [
  {
    photo_url: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Jocelyn Gouse",
    leave_type: "Annual Leave",
    start_date: "2024-07-20",
    end_date: "2024-07-25",
    reason: "Family vacation to the Bahamas.",
    status: "Pending",
  },
  {
    photo_url: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Jaydon Siphron",
    leave_type: "Sick Leave",
    start_date: "2024-07-18",
    end_date: "2024-07-18",
    reason: "Feeling unwell, doctor's appointment.",
    status: "Pending",
  },
  {
    photo_url: "https://randomuser.me/api/portraits/women/50.jpg",
    name: "Mira Herwitz",
    leave_type: "Personal Leave",
    start_date: "2024-07-22",
    end_date: "2024-07-23",
    reason: "Important personal appointment.",
    status: "Pending",
  },
  {
    photo_url: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "Ruben Torff",
    leave_type: "Sick Leave",
    start_date: "2024-07-19",
    end_date: "2024-07-19",
    reason: "Migraine.",
    status: "Pending",
  },
];

function PendingLeave() {
  const [search, setSearch] = useState("");

  const filteredLeaves = pendingLeavesData.filter(
    (leave) =>
      leave.name.toLowerCase().includes(search.toLowerCase()) ||
      leave.leave_type.toLowerCase().includes(search.toLowerCase()) ||
      leave.reason.toLowerCase().includes(search.toLowerCase())
  );

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
              {filteredLeaves.map((leave, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default PendingLeave;