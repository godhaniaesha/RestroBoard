import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "../Style/Z_table.css";
import "../Style/x_app.css";
import { Container } from "react-bootstrap";

Chart.register(ArcElement, Tooltip, Legend);

const stockData = [
  {
    item_photo_url:
      "https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&w=400",
    item_name: "All-Purpose Flour",
    category: "Dry Goods",
    quantity: 50,
    unit: "kg",
    price: 1.5,
    last_updated: "2024-07-20",
    status: "In Stock",
  },
  {
    item_photo_url:
      "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400",
    item_name: "Fresh Tomatoes",
    category: "Vegetables",
    quantity: 25,
    unit: "kg",
    price: 2.0,
    last_updated: "2024-07-21",
    status: "In Stock",
  },
  {
    item_photo_url:
      "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400",
    item_name: "Olive Oil",
    category: "Oils",
    quantity: 10,
    unit: "liters",
    price: 8.0,
    last_updated: "2024-07-19",
    status: "Low Stock",
  },
  {
    item_photo_url:
      "https://images.pexels.com/photos/6107776/pexels-photo-6107776.jpeg?auto=compress&cs=tinysrgb&w=400",
    item_name: "Chicken Breast",
    category: "Meat",
    quantity: 0,
    unit: "kg",
    price: 5.5,
    last_updated: "2024-07-18",
    status: "Out of Stock",
  },
];

function InventoryReport() {
  const [search, setSearch] = useState("");

  // Summary
  const totalItems = stockData.length;
  const totalValue = stockData.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const lowStock = stockData.filter((item) => item.status === "Low Stock").length;
  const outOfStock = stockData.filter((item) => item.status === "Out of Stock").length;

  // Pie Chart Data
  const pieData = {
    labels: ["In Stock", "Low Stock", "Out of Stock"],
    datasets: [
      {
        data: [
          stockData.filter((i) => i.status === "In Stock").length,
          lowStock,
          outOfStock,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  const filteredStock = stockData.filter(
    (item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container fluid className="x_inv_section">
        <h2 className="x_rep_title">Inventory Report</h2>
      <div className="x_inv_container">
        {/* Summary Cards Row */}
        <div className="x_inv_summaryRow">
          <div className="x_inv_summaryCard">
            <div className="x_inv_cardTitle">Total Items</div>
            <div className="x_inv_cardValue">{totalItems}</div>
          </div>
          <div className="x_inv_summaryCard">
            <div className="x_inv_cardTitle">Low Stock</div>
            <div className="x_inv_cardValue">{lowStock}</div>
          </div>
          <div className="x_inv_summaryCard">
            <div className="x_inv_cardTitle">Out of Stock</div>
            <div className="x_inv_cardValue">{outOfStock}</div>
          </div>
          <div className="x_inv_summaryCard">
            <div className="x_inv_cardTitle">Total Value</div>
            <div className="x_inv_cardValue">${totalValue.toFixed(2)}</div>
          </div>
        </div>
        {/* Chart & Table Row */}
        <div className="x_inv_mainRow">
          <div className="x_inv_chartCard">
            <h5 className="x_inv_chartTitle">Stock Status</h5>
            <Pie data={pieData} options={{ plugins: { legend: { position: "bottom" } } }} />
          </div>
          <div className="x_inv_tableCard">
            <div className="x_inv_controls">
              <input
                className="x_inv_searchInput"
                type="text"
                placeholder="Search Stock..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="x_inv_tableWrapper">
              <table className="Z_SM_table">
                <thead>
                  <tr>
                    <th className="Z_SM_Th">Item</th>
                    <th className="Z_SM_Th">Category</th>
                    <th className="Z_SM_Th">Quantity</th>
                    <th className="Z_SM_Th">Price</th>
                    <th className="Z_SM_Th">Last Updated</th>
                    <th className="Z_SM_Th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStock.map((item, idx) => (
                    <tr className="Z_SM_Tr" key={idx}>
                      <td className="Z_SM_Td">
                        <div className="Z_SM_itemCell">
                          <img
                            src={item.item_photo_url}
                            alt={item.item_name}
                            className="Z_SM_photo"
                          />
                          <span>{item.item_name}</span>
                        </div>
                      </td>
                      <td className="Z_SM_Td">{item.category}</td>
                      <td className="Z_SM_Td">{`${item.quantity} ${item.unit}`}</td>
                      <td className="Z_SM_Td">{`$${item.price.toFixed(2)}`}</td>
                      <td className="Z_SM_Td">{item.last_updated}</td>
                      <td className="Z_SM_Td">
                        <span
                          className={`Z_SM_status Z_SM_status--${item.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default InventoryReport;
