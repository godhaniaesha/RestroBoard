import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployee } from "../redux/slice/user.slice";
import "../Style/Z_table.css";
import { FaRegEdit, FaRegTrashAlt, FaChevronDown } from "react-icons/fa";

function EmployeeList({ setActiveItem }) {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    localStorage.setItem("editEmployeeId", id);
    setActiveItem("employees-edit");
  };

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
                  className={`Z_empList_dropdownIcon ${
                    isDropdownOpen ? "open" : ""
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
            <p className="text-center">Loading employees...</p>
          ) : (
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
                {filtered.length > 0 ? (
                  filtered.map(
                    (emp, idx) => (
                      console.log(emp, "dfghjk"),
                      (
                        <tr className="Z_empListTr" key={idx}>
                          <td className="Z_empListTd">
                            <img
                              src={
                                emp.photo_url ||
                                "https://via.placeholder.com/40"
                              }
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
                          <td className="Z_empListTd">{emp.joining_date}</td>
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
                            >
                              <FaRegTrashAlt />
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default EmployeeList;
