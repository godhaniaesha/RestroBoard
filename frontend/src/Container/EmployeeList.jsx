import React, { useState, useRef, useEffect } from "react";
import "../Style/Z_table.css";
import { FaRegEdit, FaRegTrashAlt, FaChevronDown } from "react-icons/fa";

const employees = [
  {
    photo_url: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Lincoln Ekstrom",
    role: "Manager",
    email: "lincoln.ekstrom@email.com",
    phone: "+1 555-123-4567",
    joining_date: "2021-04-10",
  },
  {
    photo_url: "https://randomuser.me/api/portraits/men/33.jpg",
    name: "Emerson Kors",
    role: "Stylist",
    email: "emerson.kors@email.com",
    phone: "+1 555-234-5678",
    joining_date: "2021-03-15",
  },
  {
    photo_url: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Alfonsa Kors",
    role: "Receptionist",
    email: "alfonsa.kors@email.com",
    phone: "+1 555-345-6789",
    joining_date: "2021-02-20",
  },
  {
    photo_url: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "Ruben Torff",
    role: "Stylist",
    email: "ruben.torff@email.com",
    phone: "+1 555-456-7890",
    joining_date: "2021-01-05",
  },
];

function EmployeeList() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get unique roles for dropdown
  const roles = [
    ...new Set(["All Roles", ...employees.map((e) => e.role)])
  ];

  // Filter employees by search and role
  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone.toLowerCase().includes(search.toLowerCase()) ||
      emp.joining_date.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === "" || role === "All Roles" || emp.role === role;
    return matchesSearch && matchesRole;
  });

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

  return (
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
              {filtered.map((emp, idx) => (
                <tr className="Z_empListTr" key={idx}>
                  <td className="Z_empListTd">
                    <img src={emp.photo_url} alt={emp.name} className="Z_empListPhoto" />
                  </td>
                  <td className="Z_empListTd">{emp.name}</td>
                  <td className="Z_empListTd">{emp.role}</td>
                  <td className="Z_empListTd">{emp.email}</td>
                  <td className="Z_empListTd">{emp.phone}</td>
                  <td className="Z_empListTd">{emp.joining_date}</td>
                  <td className="Z_empListTd">
                    <button className="Z_empListActionBtn" title="Edit">
                      <FaRegEdit />
                    </button>
                    <button className="Z_empListActionBtn" title="Delete">
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

export default EmployeeList;
