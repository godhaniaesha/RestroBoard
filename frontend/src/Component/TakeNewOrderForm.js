import React, { useState } from "react";
import "../Style/x_app.css";

const TakeNewOrderForm = () => {
  const [orderData, setOrderData] = useState({
    tableNumber: "",
    items: [],
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value,
    });
  };

  const handleAddItem = () => {
    setOrderData({
      ...orderData,
      items: [...orderData.items, { name: "", quantity: 1 }],
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderData.items];
    newItems[index][field] = value;
    setOrderData({
      ...orderData,
      items: newItems,
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = orderData.items.filter((_, i) => i !== index);
    setOrderData({
      ...orderData,
      items: newItems,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", orderData);
    setOrderData({
      tableNumber: "",
      items: [],
      notes: "",
    });
  };

  return (
    <div className="content-section">
      <h2>Take New Order</h2>
      <div className="card">
        <div className="card-body">
          <section className="x_employee-section">
            <h4 className="x_employee-heading">Order Form</h4>
            <div className="x_popup">
              <form onSubmit={handleSubmit} className="row g-3 mt-3">
                <div className="col-md-6">
                  <label htmlFor="tableNumber" className="form-label">Table Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tableNumber"
                    name="tableNumber"
                    value={orderData.tableNumber}
                    onChange={handleInputChange}
                    placeholder="Enter table number"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Items</label>
                  {orderData.items.map((item, index) => (
                    <div className="row g-2 align-items-center mb-2" key={index}>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          placeholder="Item name"
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value, 10))}
                          min="1"
                          placeholder="Quantity"
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>

                <div className="col-12">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    value={orderData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any special instructions?"
                  ></textarea>
                </div>

                <div className="col-12 d-flex justify-content-center x_btn_main">
                  <button type="submit" className="btn btn-primary mx-2">Submit Order</button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TakeNewOrderForm;
