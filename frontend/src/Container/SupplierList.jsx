import React from "react";
import "../Style/Z_table.css";

const suppliers = [
  {
    name: "Fresh Farms Ltd.",
    phone: "+1 555-111-2222",
    email: "contact@freshfarms.com",
    whatsapp: "+1 555-111-3333",
    address: "123 Main St, Springfield, USA",
    ingredients: "Tomatoes, Lettuce, Onions",
  },
  {
    name: "Organic Goods",
    phone: "+1 555-222-4444",
    email: "info@organicgoods.com",
    whatsapp: "+1 555-222-5555",
    address: "456 Oak Ave, Metropolis, USA",
    ingredients: "Flour, Olive Oil, Cheese",
  },
  {
    name: "Spice Traders",
    phone: "+1 555-333-6666",
    email: "sales@spicetraders.com",
    whatsapp: "+1 555-333-7777",
    address: "789 Pine Rd, Gotham, USA",
    ingredients: "Spices, Herbs, Salt",
  },
];

function SupplierList() {
  return (
    <section className="Z_empListSection">
      <div className="Z_empListTableContainer">
        <div className="Z_empList_headerRow">
          <h4 className="Z_empListTitle">Suppliers List</h4>
        </div>
        <div className="Z_empListTableWrapper">
          <table className="Z_empListTable">
            <thead>
              <tr>
                <th className="Z_empListTh">Name</th>
                <th className="Z_empListTh">Phone</th>
                <th className="Z_empListTh">Email</th>
                <th className="Z_empListTh">WhatsApp</th>
                <th className="Z_empListTh">Address</th>
                <th className="Z_empListTh">Ingredients</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((sup, idx) => (
                <tr className="Z_empListTr" key={idx}>
                  <td className="Z_empListTd">{sup.name}</td>
                  <td className="Z_empListTd">{sup.phone}</td>
                  <td className="Z_empListTd">{sup.email}</td>
                  <td className="Z_empListTd">{sup.whatsapp}</td>
                  <td className="Z_empListTd">{sup.address}</td>
                  <td className="Z_empListTd">{sup.ingredients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default SupplierList;
