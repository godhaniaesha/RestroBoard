import React, { useState } from "react";
import "../Style/Z_table.css";
import { FaEye, FaRegTrashAlt } from "react-icons/fa";

const billingData = [
  {
    invoice_id: "INV-2024-001",
    customer_photo_url: "https://randomuser.me/api/portraits/men/85.jpg",
    customer_name: "Liam Anderson",
    date: "2024-07-22",
    amount: 125.5,
    status: "Paid",
    payment_method: "Credit Card",
  },
  {
    invoice_id: "INV-2024-002",
    customer_photo_url: "https://randomuser.me/api/portraits/women/75.jpg",
    customer_name: "Olivia Martinez",
    date: "2024-07-21",
    amount: 89.9,
    status: "Pending",
    payment_method: "Cash",
  },
  {
    invoice_id: "INV-2024-003",
    customer_photo_url: "https://randomuser.me/api/portraits/men/62.jpg",
    customer_name: "Noah Thompson",
    date: "2024-07-20",
    amount: 210.0,
    status: "Overdue",
    payment_method: "Bank Transfer",
  },
  {
    invoice_id: "INV-2024-004",
    customer_photo_url: "https://randomuser.me/api/portraits/women/52.jpg",
    customer_name: "Emma Garcia",
    date: "2024-07-19",
    amount: 76.25,
    status: "Paid",
    payment_method: "Credit Card",
  },
];

function Billing() {
  const [search, setSearch] = useState("");

  const filteredBilling = billingData.filter(
    (bill) =>
      bill.invoice_id.toLowerCase().includes(search.toLowerCase()) ||
      bill.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      bill.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="Z_Billing_section">
      <div className="Z_Billing_container">
        <div className="Z_Billing_headerRow">
          <h4 className="Z_Billing_title">Billing & Invoices</h4>
          <div className="Z_Billing_controls">
            <input
              className="Z_Billing_searchInput"
              type="text"
              placeholder="Search Invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="Z_Billing_tableWrapper">
          <table className="Z_Billing_table">
            <thead>
              <tr>
                <th className="Z_Billing_Th">Invoice ID</th>
                <th className="Z_Billing_Th">Customer</th>
                <th className="Z_Billing_Th">Date</th>
                <th className="Z_Billing_Th">Amount</th>
                <th className="Z_Billing_Th">Status</th>
                <th className="Z_Billing_Th">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBilling.map((bill, idx) => (
                <tr className="Z_Billing_Tr" key={idx}>
                  <td className="Z_Billing_Td">{bill.invoice_id}</td>
                  <td className="Z_Billing_Td">
                    <div className="Z_Billing_customerCell">
                      <img
                        src={bill.customer_photo_url}
                        alt={bill.customer_name}
                        className="Z_Billing_photo"
                      />
                      <span>{bill.customer_name}</span>
                    </div>
                  </td>
                  <td className="Z_Billing_Td">{bill.date}</td>
                  <td className="Z_Billing_Td">{`$${bill.amount.toFixed(
                    2
                  )}`}</td>
                  <td className="Z_Billing_Td">
                    <span
                      className={`Z_Billing_status Z_Billing_status--${bill.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="Z_Billing_Td">
                    <button
                      className="Z_Billing_actionBtn Z_Billing_actionBtn--view"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="Z_Billing_actionBtn Z_Billing_actionBtn--delete"
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

export default Billing;
