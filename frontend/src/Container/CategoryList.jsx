import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../Style/Z_table.css";
import { fetchCategories } from "../redux/slice/category.slice";

function CategoryList() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <section className="Z_empListSection">
      <div className="Z_empListTableContainer">
        <div className="Z_empList_headerRow">
          <h4 className="Z_empListTitle">Category List</h4>
        </div>
        <div className="Z_empListTableWrapper">
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <table className="Z_empListTable">
            <thead>
              <tr>
                <th className="Z_empListTh">Image</th>
                <th className="Z_empListTh">Name</th>
                <th className="Z_empListTh">Description</th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.length > 0
                ? categories.map((cat, idx) => (
                    <tr className="Z_empListTr" key={cat._id || idx}>
                      <td className="Z_empListTd">
                        {cat.category_image ? (
                          <img
                            src={`http://localhost:3000${cat.category_image}`}
                            alt={cat.category_name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 6,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td className="Z_empListTd">{cat.category_name}</td>
                      <td className="Z_empListTd">
                        {cat.category_description}
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan="3">No categories found.</td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CategoryList;
