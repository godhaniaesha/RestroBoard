import React, { useState } from "react";
import "../Style/Z_table.css";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaChartBar,
  FaMoneyBillWave,
  FaBoxOpen,
  FaUserClock,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Sample Data
const salesData = [
  { date: "2024-07-01", revenue: 450, transactions: 20 },
  { date: "2024-07-02", revenue: 550, transactions: 25 },
  { date: "2024-07-03", revenue: 600, transactions: 30 },
  { date: "2024-07-04", revenue: 500, transactions: 28 },
  { date: "2024-07-05", revenue: 700, transactions: 35 },
];

const stockData = [
  { item: "Flour", consumed: 20, unit: "kg" },
  { item: "Tomatoes", consumed: 15, unit: "kg" },
  { item: "Olive Oil", consumed: 5, unit: "liters" },
];

const leaveData = [
  { employee: "Lincoln Ekstrom", leave_type: "Annual", days: 5 },
  { employee: "Emerson Kors", leave_type: "Sick", days: 2 },
  { employee: "Ruben Torff", leave_type: "Personal", days: 1 },
];

const Reports = () => {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState({
    start: "2024-07-01",
    end: "2024-07-05",
  });

  const handleExport = (format) => {
    const doc = new jsPDF();
    const tableData =
      reportType === "sales"
        ? salesData
        : reportType === "stock"
        ? stockData
        : leaveData;
    const head =
      reportType === "sales"
        ? [["Date", "Revenue", "Transactions"]]
        : reportType === "stock"
        ? [["Item", "Consumed", "Unit"]]
        : [["Employee", "Leave Type", "Days"]];
    const body = tableData.map((row) => Object.values(row));

    if (format === "pdf") {
      doc.autoTable({ head, body });
      doc.save(`${reportType}_report.pdf`);
    } else if (format === "xlsx") {
      const ws = XLSX.utils.json_to_sheet(tableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${reportType}_report.xlsx`);
    } else if (format === "csv") {
      const ws = XLSX.utils.json_to_sheet(tableData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportType}_report.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderTable = () => {
    switch (reportType) {
      case "sales":
        return (
          <table className="Z_RP_table">
            <thead>
              <tr>
                <th className="Z_RP_Th">Date</th>
                <th className="Z_RP_Th">Revenue</th>
                <th className="Z_RP_Th">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((row, idx) => (
                <tr key={idx}>
                  <td className="Z_RP_Td">{row.date}</td>
                  <td className="Z_RP_Td">{`$${row.revenue.toFixed(2)}`}</td>
                  <td className="Z_RP_Td">{row.transactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "stock":
        return (
          <table className="Z_RP_table">
            <thead>
              <tr>
                <th className="Z_RP_Th">Item</th>
                <th className="Z_RP_Th">Consumed</th>
                <th className="Z_RP_Th">Unit</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((row, idx) => (
                <tr key={idx}>
                  <td className="Z_RP_Td">{row.item}</td>
                  <td className="Z_RP_Td">{row.consumed}</td>
                  <td className="Z_RP_Td">{row.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "leave":
        return (
          <table className="Z_RP_table">
            <thead>
              <tr>
                <th className="Z_RP_Th">Employee</th>
                <th className="Z_RP_Th">Leave Type</th>
                <th className="Z_RP_Th">Days</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((row, idx) => (
                <tr key={idx}>
                  <td className="Z_RP_Td">{row.employee}</td>
                  <td className="Z_RP_Td">{row.leave_type}</td>
                  <td className="Z_RP_Td">{row.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <section className="Z_RP_section">
      <div className="Z_RP_container">
        <div className="Z_RP_headerRow">
          <h4 className="Z_RP_title">Reports</h4>
          <div className="Z_RP_controls">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="Z_RP_select"
            >
              <option value="sales">Sales Report</option>
              <option value="stock">Stock Consumption</option>
              <option value="leave">Employee Leave</option>
            </select>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="Z_RP_datePicker"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="Z_RP_datePicker"
            />
          </div>
        </div>

        <div className="Z_RP_summaryCards">
          <div className="Z_RP_card">
            <FaMoneyBillWave className="Z_RP_cardIcon" />
            <div>
              <div className="Z_RP_cardTitle">Total Sales</div>
              <div className="Z_RP_cardValue">$2,750.00</div>
            </div>
          </div>
          <div className="Z_RP_card">
            <FaBoxOpen className="Z_RP_cardIcon" />
            <div>
              <div className="Z_RP_cardTitle">Most Used Item</div>
              <div className="Z_RP_cardValue">Flour</div>
            </div>
          </div>
          <div className="Z_RP_card">
            <FaUserClock className="Z_RP_cardIcon" />
            <div>
              <div className="Z_RP_cardTitle">Total Leaves</div>
              <div className="Z_RP_cardValue">8 Days</div>
            </div>
          </div>
        </div>

        <div className="Z_RP_content">
          <div className="Z_RP_chartContainer">
            <h5 className="Z_RP_chartTitle">Sales Trend</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="Z_RP_tableContainer">
            <div className="Z_RP_tableHeader">
              <h5 className="Z_RP_tableTitle">{`${
                reportType.charAt(0).toUpperCase() + reportType.slice(1)
              } Report`}</h5>
              <div className="Z_RP_exportButtons">
                {/* <button
                  onClick={() => handleExport("pdf")}
                  className="Z_RP_exportBtn"
                >
                  <FaFilePdf />
                </button> */}
                <button
                  onClick={() => handleExport("xlsx")}
                  className="Z_RP_exportBtn"
                >
                  <FaFileExcel />
                </button>
                <button
                  onClick={() => handleExport("csv")}
                  className="Z_RP_exportBtn"
                >
                  <FaFileCsv />
                </button>
              </div>
            </div>
            {renderTable()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reports;