import React, { useState, useRef, useEffect } from "react";
import "../Style/Z_table.css";
import {
  FaChevronDown,
  FaRegEye,
  FaRegTrashAlt,
} from "react-icons/fa";

const orders = [
  {
    id: "#1024",
    customer: "Rayan Gosling",
    date: "2024-07-20",
    amount: 85.5,
    status: "Completed",
  },
  {
    id: "#1025",
    customer: "John Smith",
    date: "2024-07-21",
    amount: 42.0,
    status: "Pending",
  },
  {
    id: "#1026",
    customer: "Jane Doe",
    date: "2024-07-21",
    amount: 120.75,
    status: "Completed",
  },
  {
    id: "#1027",
    customer: "Peter Jones",
    date: "2024-07-22",
    amount: 33.2,
    status: "Cancelled",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1028",
    customer: "Mary Brown",
    date: "2024-07-22",
    amount: 60.0,
    status: "Pending",
  },
  {
    id: "#1029",
    customer: "John Doe",
    date: "2024-01-15",
    amount: 150.25,
    status: "Completed",
  },
  {
    id: "#1030",
    customer: "Jane Smith",
    date: "2024-01-16",
    amount: 75.5,
    status: "Pending",
  },
  {
    id: "#1031",
    customer: "Peter Jones",
    date: "2024-01-17",
    amount: 200.0,
    status: "Cancelled",
  },
  {
    id: "#1032",
    customer: "Mary Brown",
    date: "2024-01-18",
    amount: 45.8,
    status: "Completed",
  },
  {
    id: "#1033",
    customer: "Chris Davis",
    date: "2024-01-19",
    amount: 110.0,
    status: "Pending",
  },
  {
    id: "#1034",
    customer: "Jennifer Wilson",
    date: "2024-01-20",
    amount: 89.99,
    status: "Completed",
  },
  {
    id: "#1035",
    customer: "Michael Miller",
    date: "2024-01-21",
    amount: 12.34,
    status: "Pending",
  },
  {
    id: "#1036",
    customer: "Linda Taylor",
    date: "2024-01-22",
    amount: 55.55,
    status: "Completed",
  },
  {
    id: "#1037",
    customer: "David Anderson",
    date: "2024-01-23",
    amount: 67.89,
    status: "Cancelled",
  },
  {
    id: "#1038",
    customer: "Susan Thomas",
    date: "2024-01-24",
    amount: 99.99,
    status: "Pending",
  },
  {
    id: "#1039",
    customer: "John Miller",
    date: "2024-02-01",
    amount: 123.45,
    status: "Completed",
  },
  {
    id: "#1040",
    customer: "Jane Anderson",
    date: "2024-02-02",
    amount: 543.21,
    status: "Pending",
  },
  {
    id: "#1041",
    customer: "Peter Thomas",
    date: "2024-02-03",
    amount: 98.76,
    status: "Completed",
  },
  {
    id: "#1042",
    customer: "Mary Wilson",
    date: "2024-02-04",
    amount: 11.22,
    status: "Cancelled",
  },
  {
    id: "#1043",
    customer: "Chris Taylor",
    date: "2024-02-05",
    amount: 33.44,
    status: "Completed",
  },
  {
    id: "#1044",
    customer: "Jennifer Smith",
    date: "2024-02-06",
    amount: 55.66,
    status: "Pending",
  },
  {
    id: "#1045",
    customer: "Michael Davis",
    date: "2024-02-07",
    amount: 77.88,
    status: "Completed",
  },
  {
    id: "#1046",
    customer: "Linda Brown",
    date: "2024-02-08",
    amount: 99.0,
    status: "Pending",
  },
  {
    id: "#1047",
    customer: "David Jones",
    date: "2024-02-09",
    amount: 135.79,
    status: "Cancelled",
  },
  {
    id: "#1048",
    customer: "Susan Doe",
    date: "2024-02-10",
    amount: 246.8,
    status: "Completed",
  },
  {
    id: "#1049",
    customer: "Tom Hardy",
    date: "2024-07-23",
    amount: 15.0,
    status: "Completed",
  },
  {
    id: "#1050",
    customer: "Emma Stone",
    date: "2024-07-23",
    amount: 205.0,
    status: "Pending",
  },
  {
    id: "#1051",
    customer: "Chris Hemsworth",
    date: "2024-07-24",
    amount: 78.25,
    status: "Completed",
  },
  {
    id: "#1052",
    customer: "Scarlett Johansson",
    date: "2024-07-24",
    amount: 95.0,
    status: "Cancelled",
  },
  {
    id: "#1053",
    customer: "Robert Downey Jr.",
    date: "2024-07-25",
    amount: 300.0,
    status: "Pending",
  },
  {
    id: "#1054",
    customer: "Jennifer Lawrence",
    date: "2024-07-25",
    amount: 150.75,
    status: "Completed",
  },
  {
    id: "#1055",
    customer: "Will Smith",
    date: "2024-07-26",
    amount: 180.5,
    status: "Completed",
  },
  {
    id: "#1056",
    customer: "Angelina Jolie",
    date: "2024-07-26",
    amount: 220.0,
    status: "Pending",
  },
  {
    id: "#1057",
    customer: "Brad Pitt",
    date: "2024-07-27",
    amount: 135.2,
    status: "Cancelled",
  },
  {
    id: "#1058",
    customer: "Leonardo DiCaprio",
    date: "2024-07-27",
    amount: 450.0,
    status: "Completed",
  },
  {
    id: "#1059",
    customer: "Alice Johnson",
    date: "2024-08-01",
    amount: 55.0,
    status: "Completed",
  },
  {
    id: "#1060",
    customer: "Bob Williams",
    date: "2024-08-01",
    amount: 88.0,
    status: "Pending",
  },
  {
    id: "#1061",
    customer: "Charlie Garcia",
    date: "2024-08-02",
    amount: 120.0,
    status: "Completed",
  },
  {
    id: "#1062",
    customer: "Diana Martinez",
    date: "2024-08-02",
    amount: 40.25,
    status: "Cancelled",
  },
  {
    id: "#1063",
    customer: "Ethan Rodriguez",
    date: "2024-08-03",
    amount: 250.0,
    status: "Pending",
  },
  {
    id: "#1064",
    customer: "Fiona Lee",
    date: "2024-08-03",
    amount: 70.5,
    status: "Completed",
  },
  {
    id: "#1065",
    customer: "George Hernandez",
    date: "2024-08-04",
    amount: 95.8,
    status: "Completed",
  },
  {
    id: "#1066",
    customer: "Hannah Lopez",
    date: "2024-08-04",
    amount: 115.0,
    status: "Pending",
  },
  {
    id: "#1067",
    customer: "Ian Gonzalez",
    date: "2024-08-05",
    amount: 30.0,
    status: "Cancelled",
  },
  {
    id: "#1068",
    customer: "Jack Perez",
    date: "2024-08-05",
    amount: 500.0,
    status: "Completed",
  },
  {
    id: "#1069",
    customer: "Karen Sanchez",
    date: "2024-09-10",
    amount: 15.25,
    status: "Completed",
  },
  {
    id: "#1070",
    customer: "Liam Rivera",
    date: "2024-09-10",
    amount: 210.0,
    status: "Pending",
  },
  {
    id: "#1071",
    customer: "Mia Torres",
    date: "2024-09-11",
    amount: 82.5,
    status: "Completed",
  },
  {
    id: "#1072",
    customer: "Noah Ramirez",
    date: "2024-09-11",
    amount: 99.99,
    status: "Cancelled",
  },
  {
    id: "#1073",
    customer: "Olivia Flores",
    date: "2024-09-12",
    amount: 320.0,
    status: "Pending",
  },
  {
    id: "#1074",
    customer: "Lucas Gomez",
    date: "2024-09-12",
    amount: 175.0,
    status: "Completed",
  },
  {
    id: "#1075",
    customer: "Sophia Cruz",
    date: "2024-09-13",
    amount: 190.5,
    status: "Completed",
  },
  {
    id: "#1076",
    customer: "Mason Reyes",
    date: "2024-09-13",
    amount: 230.0,
    status: "Pending",
  },
  {
    id: "#1077",
    customer: "Ava Morales",
    date: "2024-09-14",
    amount: 140.2,
    status: "Cancelled",
  },
  {
    id: "#1078",
    customer: "Elijah Gutierrez",
    date: "2024-09-14",
    amount: 475.0,
    status: "Completed",
  },
  {
    id: "#1079",
    customer: "Amelia Ortiz",
    date: "2024-10-01",
    amount: 65.0,
    status: "Completed",
  },
  {
    id: "#1080",
    customer: "James Jimenez",
    date: "2024-10-01",
    amount: 92.0,
    status: "Pending",
  },
  {
    id: "#1081",
    customer: "Charlotte Chavez",
    date: "2024-10-02",
    amount: 130.0,
    status: "Completed",
  },
  {
    id: "#1082",
    customer: "Benjamin Ramos",
    date: "2024-10-02",
    amount: 42.75,
    status: "Cancelled",
  },
  {
    id: "#1083",
    customer: "Harper Mendoza",
    date: "2024-10-03",
    amount: 260.0,
    status: "Pending",
  },
  {
    id: "#1084",
    customer: "Logan Castillo",
    date: "2024-10-03",
    amount: 75.5,
    status: "Completed",
  },
  {
    id: "#1085",
    customer: "Evelyn Alvarez",
    date: "2024-10-04",
    amount: 105.8,
    status: "Completed",
  },
  {
    id: "#1086",
    customer: "Alexander Vasquez",
    date: "2024-10-04",
    amount: 125.0,
    status: "Pending",
  },
  {
    id: "#1087",
    customer: "Abigail Diaz",
    date: "2024-10-05",
    amount: 35.0,
    status: "Cancelled",
  },
  {
    id: "#1088",
    customer: "Michael Santos",
    date: "2024-10-05",
    amount: 550.0,
    status: "Completed",
  },
  {
    id: "#1089",
    customer: "Emily Snyder",
    date: "2024-11-15",
    amount: 22.5,
    status: "Completed",
  },
  {
    id: "#1090",
    customer: "Daniel Hawkins",
    date: "2024-11-15",
    amount: 240.0,
    status: "Pending",
  },
  {
    id: "#1091",
    customer: "Madison Ferguson",
    date: "2024-11-16",
    amount: 90.0,
    status: "Completed",
  },
  {
    id: "#1092",
    customer: "Jacob Palmer",
    date: "2024-11-16",
    amount: 105.5,
    status: "Cancelled",
  },
  {
    id: "#1093",
    customer: "Chloe Wagner",
    date: "2024-11-17",
    amount: 350.0,
    status: "Pending",
  },
  {
    id: "#1094",
    customer: "William Fisher",
    date: "2024-11-17",
    amount: 185.0,
    status: "Completed",
  },
  {
    id: "#1095",
    customer: "Ella Webb",
    date: "2024-11-18",
    amount: 200.0,
    status: "Completed",
  },
  {
    id: "#1096",
    customer: "Samuel Hunt",
    date: "2024-11-18",
    amount: 250.0,
    status: "Pending",
  },
  {
    id: "#1097",
    customer: "Avery Armstrong",
    date: "2024-11-19",
    amount: 155.2,
    status: "Cancelled",
  },
  {
    id: "#1098",
    customer: "Sofia Larson",
    date: "2024-11-19",
    amount: 490.0,
    status: "Completed",
  },
];

export default function ActiveOrder() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const statuses = [
    ...new Set(["All Statuses", ...orders.map((o) => o.status)]),
  ];

  const filtered = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.date.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      status === "" || status === "All Statuses" || order.status === status;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all page numbers
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For more than 5 pages, use smart pagination
    const pageNumbers = [];

    // Always show the first page
    pageNumbers.push(1);

    // Show '...' if the current page is not near the start
    if (currentPage > 2) {
      pageNumbers.push("...");
    }

    // Show the current page if it's not the first or last
    if (currentPage !== 1 && currentPage !== totalPages) {
      pageNumbers.push(currentPage);
    }

    // Show '...' if the current page is not near the end
    if (currentPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always show the last page
    pageNumbers.push(totalPages);

    return [...new Set(pageNumbers)]; // Use Set to remove duplicates, e.g., for totalPages=2
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

  return (
    <section className="Z_AO_section">
      <div className="Z_AO_container">
        <div className="Z_AO_headerRow">
          <h4 className="Z_AO_title">Active Orders</h4>
          <div className="Z_AO_controls">
            <div>
            <input
              className="Z_AO_searchInput"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            </div>
            <div className="Z_AO_dropdownWrapper" ref={dropdownRef}>
              <button
                className="Z_AO_statusDropdown"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{status || "All Statuses"}</span>
                <FaChevronDown
                  className={`Z_AO_dropdownIcon ${isDropdownOpen ? "open" : ""}`}
                />
              </button>
              {isDropdownOpen && (
                <div className="Z_AO_dropdownMenu">
                  {statuses.map((s) => (
                    <div
                      key={s}
                      className="Z_AO_dropdownItem"
                      onClick={() => {
                        setStatus(s === "All Statuses" ? "" : s);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="Z_AO_tableWrapper">
          <table className="Z_AO_table">
            <thead>
              <tr>
                <th className="Z_AO_Th">Order ID</th>
                <th className="Z_AO_Th">Customer</th>
                <th className="Z_AO_Th">Date</th>
                <th className="Z_AO_Th">Amount</th>
                <th className="Z_AO_Th">Status</th>
                <th className="Z_AO_Th">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order, idx) => (
                <tr className="Z_AO_Tr" key={idx}>
                  <td className="Z_AO_Td">{order.id}</td>
                  <td className="Z_AO_Td">{order.customer}</td>
                  <td className="Z_AO_Td">{order.date}</td>
                  <td className="Z_AO_Td">{`$${order.amount.toFixed(2)}`}</td>
                  <td className="Z_AO_Td">
                    <span
                      className={`Z_AO_status Z_AO_status--${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="Z_AO_Td">
                    <button className="Z_AO_actionBtn" title="View">
                      <FaRegEye />
                    </button>
                    <button className="Z_AO_actionBtn" title="Delete">
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="Z_AO_paginationContainer">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="Z_AO_paginationBtn"
          >
            &laquo;
          </button>
          {renderPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={index} className="Z_AO_paginationEllipsis">
                  ...
                </span>
              );
            }
            return (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`Z_AO_pageNumber ${
                  currentPage === page ? "Z_AO_pageNumber--active" : ""
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="Z_AO_paginationBtn"
          >
            &raquo;
          </button>
        </div>
      </div>
    </section>
  );
}
