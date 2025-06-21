import React, { useState } from "react";
import "../Style/Z_table.css";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const stockData = [
  {
    item_photo_url: "https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&w=400",
    item_name: "All-Purpose Flour",
    category: "Dry Goods",
    quantity: 50,
    unit: "kg",
    price: 1.5,
    last_updated: "2024-07-20",
    status: "In Stock",
  },
  {
    item_photo_url: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400",
    item_name: "Fresh Tomatoes",
    category: "Vegetables",
    quantity: 25,
    unit: "kg",
    price: 2.0,
    last_updated: "2024-07-21",
    status: "In Stock",
  },
  {
    item_photo_url: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400",
    item_name: "Olive Oil",
    category: "Oils",
    quantity: 10,
    unit: "liters",
    price: 8.0,
    last_updated: "2024-07-19",
    status: "Low Stock",
  },
  {
    item_photo_url: "https://images.pexels.com/photos/6107776/pexels-photo-6107776.jpeg?auto=compress&cs=tinysrgb&w=400",
    item_name: "Chicken Breast",
    category: "Meat",
    quantity: 0,
    unit: "kg",
    price: 5.5,
    last_updated: "2024-07-18",
    status: "Out of Stock",
  },
];

function StockManagement() {
  const [search, setSearch] = useState("");

  const filteredStock = stockData.filter(
    (item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="Z_SM_section">
      <div className="Z_SM_container">
        <div className="Z_SM_headerRow">
          <h4 className="Z_SM_title">Stock Management</h4>
          <div className="Z_SM_controls">
            <input
              className="Z_SM_searchInput"
              type="text"
              placeholder="Search Stock..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="Z_SM_tableWrapper">
          <table className="Z_SM_table">
            <thead>
              <tr>
                <th className="Z_SM_Th">Item</th>
                <th className="Z_SM_Th">Category</th>
                <th className="Z_SM_Th">Quantity</th>
                <th className="Z_SM_Th">Price</th>
                <th className="Z_SM_Th">Last Updated</th>
                <th className="Z_SM_Th">Status</th>
                <th className="Z_SM_Th">Action</th>
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
                  <td className="Z_SM_Td">
                    <button
                      className="Z_SM_actionBtn Z_SM_actionBtn--edit"
                      title="Edit"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="Z_SM_actionBtn Z_SM_actionBtn--delete"
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

export default StockManagement;