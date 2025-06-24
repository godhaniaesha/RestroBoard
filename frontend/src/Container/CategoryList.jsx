import React from "react";
import "../Style/Z_table.css";
import Beverages from "../Image/Beverages.jpg";
import MainCourse from "../Image/Main Course.jpg";
import Desserts from "../Image/Desserts.jpg";

const categories = [
  {
    image: {Beverages},
    name: "Beverages",
    description: "All types of drinks including soft drinks, juices, and water."
  },
  {
    image: {MainCourse},
    name: "Main Course",
    description: "Main dishes such as curries, rice, and breads."
  },
  {
    image: {Desserts},
    name: "Desserts",
    description: "Cakes, ice creams, and other sweet dishes."
  }
];

function CategoryList() {
  return (
    <section className="Z_empListSection">
      <div className="Z_empListTableContainer">
        <div className="Z_empList_headerRow">
          <h4 className="Z_empListTitle">Category List</h4>
        </div>
        <div className="Z_empListTableWrapper">
          <table className="Z_empListTable">
            <thead>
              <tr>
                <th className="Z_empListTh">Image</th>
                <th className="Z_empListTh">Name</th>
                <th className="Z_empListTh">Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr className="Z_empListTr" key={idx}>
                  <td className="Z_empListTd">
                    <img src={cat.image} alt={cat.name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                  </td>
                  <td className="Z_empListTd">{cat.name}</td>
                  <td className="Z_empListTd">{cat.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CategoryList;
