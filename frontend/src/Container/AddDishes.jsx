import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDish } from '../redux/slice/dish.slice';
import { fetchCategories } from '../redux/slice/category.slice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Style/x_app.css';
import uplod from '../Image/cloud-upload.svg';

export default function AddDishes({onNavigate}) {
  const dispatch = useDispatch();
  const { categories, loading: categoryLoading } = useSelector((state) => state.category);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    badge: '',
  });

  const [supplierImg, setSupplierImg] = useState(null);
  const [supplierImgPreviewUrl, setSupplierImgPreviewUrl] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (supplierImgPreviewUrl) {
        URL.revokeObjectURL(supplierImgPreviewUrl);
      }
    };
  }, [supplierImgPreviewUrl]);

  const removeSupplierImage = () => {
    setSupplierImg(null);
    if (supplierImgPreviewUrl) {
      URL.revokeObjectURL(supplierImgPreviewUrl);
      setSupplierImgPreviewUrl(null);
    }
    const fileInput = document.getElementById('supplierImgInput');
    if (fileInput) fileInput.value = '';
  };

  const badgeOptions = [
    'Best Seller', "Chef's Choice", 'Most Loved', 'South Indian Special',
    'Most Ordered', 'Snack Star', 'Vegetarian Delight',
    'Tandoor Special', 'Punjabi Favorite', 'Mumbai Street Food',
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('dish_name', form.name);
    formData.append('category_id', form.category);
    formData.append('price', form.price);
    formData.append('badge_Tag', form.badge);
    formData.append('description', form.description);
    formData.append('rating', 5);
    if (supplierImg) {
      formData.append('dish_image', supplierImg);
    }

    const resultAction = await dispatch(createDish(formData));
    if (createDish.fulfilled.match(resultAction)) {
      toast.success('Dish added successfully!');
      onNavigate('hotel-information');
      setForm({
        name: '',
        description: '',
        category: '',
        price: '',
        badge: '',
      });
      removeSupplierImage();
    } else {
      toast.error(resultAction.payload || 'Failed to add dish');
    }
  };

  return (
    <section className="x_employee-section">
      <h4 className="x_employee-heading">Add Dish</h4>
      <div className="x_popup">
        <form className="row g-3 mt-3" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="col-12">
            <label className="form-label">Dish Image</label>
            <div
              className={`x_dropzone x_dropzone-multiple dz-clickable ${
                supplierImg ? "x_has-image" : ""
              }`}
              onClick={() =>
                document.getElementById("supplierImgInput").click()
              }
              style={{ cursor: "pointer" }}
            >
              {!supplierImg && (
                <div className="dz-message x_dz-message">
                  <img className="me-2" src={uplod} width="25" alt="upload" />
                  Drop your files here
                </div>
              )}
              <input
                id="supplierImgInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setSupplierImg(file);
                    setSupplierImgPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
              {supplierImg && supplierImgPreviewUrl && (
                <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview x_image-preview">
                  <img
                    src={supplierImgPreviewUrl}
                    alt="Supplier"
                    className="x_uploaded-image"
                  />
                  <button
                    type="button"
                    className="x_remove-image-btn"
                    onClick={removeSupplierImage}
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dish Name */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Dish Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter dish name"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="col-md-6">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categoryLoading ? (
                <option disabled>Loading...</option>
              ) : (
                categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Price */}
          <div className="col-md-6">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Badge */}
          <div className="col-md-6">
            <label htmlFor="badge" className="form-label">
              Badge/Tag
            </label>
            <select
              className="form-select"
              id="badge"
              name="badge"
              value={form.badge}
              onChange={handleChange}
              required
            >
              <option value="">Select badge/tag</option>
              {badgeOptions.map((badge) => (
                <option key={badge} value={badge}>
                  {badge}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="col-12">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the dish..."
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="col-12 d-flex justify-content-center x_btn_main">
            <button
              type="button"
              className="btn btn-secondary mx-2"
              onClick={() => {
                setForm({
                  name: "",
                  description: "",
                  category: "",
                  price: "",
                  badge: "",
                });
                removeSupplierImage();
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary mx-2">
              Create
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        style={{ zIndex: 9999 }}
      />
    </section>
  );
}
