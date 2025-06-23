import React, { useState } from 'react';
import '../Style/x_app.css';
import uplod from '../Image/cloud-upload.svg';

export default function AddDishes() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    badge: '',
  });
  const [dishImg, setDishImg] = useState(null);

  const categoryOptions = [
    'Starter',
    'Main Course',
    'Dessert',
    'Beverage',
    'Snack',
  ];
  const badgeOptions = [
    'Best Seller',
    "Chef's Choice",
    'Most Loved',
    'South Indian Special',
    'Most Ordered',
    'Snack Star',
    'Vegetarian Delight',
    'Tandoor Special',
    'Punjabi Favorite',
    'Mumbai Street Food',
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDishImg(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert('Dish information submitted!');
  };

  return (
    <section className="x_employee-section">
      <h4 className="x_employee-heading">Add Dish</h4>
      <div className="x_popup">
        <form className="row g-3 mt-3" onSubmit={handleSubmit}>
        <div className="col-12">
            <label className="form-label">Dish Image</label>
            <form
              className="x_dropzone x_dropzone-multiple dz-clickable"
              id="dropzone-multiple"
              data-dropzone="data-dropzone"
              action="#!"
              onClick={() => document.getElementById('dishImgInput').click()}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="dz-message x_dz-message"
                data-dz-message="data-dz-message"
              >
                <img className="me-2" src={uplod} width="25" alt="upload" />
                Drop your files here
              </div>
              <input
                id="dishImgInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview">
                {dishImg && <span>{dishImg.name}</span>}
              </div>
            </form>
          </div>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Dish Name</label>
            <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter dish name" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="category" className="form-label">Category</label>
            <select className="form-select" id="category" name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="number" className="form-control" id="price" name="price" value={form.price} onChange={handleChange} placeholder="Enter price" required min="0" step="0.01" />
          </div>
          <div className="col-md-6">
            <label htmlFor="badge" className="form-label">Badge/Tag</label>
            <select className="form-select" id="badge" name="badge" value={form.badge} onChange={handleChange} required>
              <option value="">Select badge/tag</option>
              {badgeOptions.map((badge) => (
                <option key={badge} value={badge}>{badge}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" id="description" name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Describe the dish..." required></textarea>
          </div>
         
          <div className="col-12 d-flex justify-content-center x_btn_main">
            <button type="button" className="btn btn-secondary mx-2">Cancel</button>
            <button type="submit" className="btn btn-primary mx-2">Create</button>
          </div>
        </form>
      </div>
    </section>
  );
}
