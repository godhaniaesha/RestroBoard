import React, { useState } from 'react';
import '../Style/x_app.css';
import uplod from '../Image/cloud-upload.svg';

export default function AddHO() {
  const [amenities, setAmenities] = useState([]);
  const [hotelImg, setHotelImg] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });

  const amenityOptions = [
    { label: 'Free Wi-Fi', icon: '📶' },
    { label: 'Swimming Pool', icon: '🏊' },
    { label: '24/7 Service', icon: '⏰' },
    { label: 'Free Parking', icon: '🅿️' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAmenityChipClick = (value) => {
    setAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setHotelImg(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert('Hotel information submitted!');
  };

  return (
    <section className="x_employee-section">
      <h4 className="x_employee-heading">Add Hotel Information</h4>
      <div className="x_popup">
        <form className="row g-3 mt-3" onSubmit={handleSubmit}>
        <div className="col-12">
            <label className="form-label">Hotel Image</label>
            <form
              className="x_dropzone x_dropzone-multiple dz-clickable"
              id="dropzone-multiple"
              data-dropzone="data-dropzone"
              action="#!"
              onClick={() => document.getElementById('hotelImgInput').click()}
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
                id="hotelImgInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview">
                {hotelImg && <span>{hotelImg.name}</span>}
              </div>
            </form>
          </div>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Hotel Name</label>
            <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter hotel name" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input type="text" className="form-control" id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" className="form-control" id="address" name="address" value={form.address} onChange={handleChange} placeholder="Enter address" required />
          </div>
          <div className="col-12">
            <label htmlFor="description" className="form-label">Description/About</label>
            <textarea className="form-control" id="description" name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Describe your hotel..." required></textarea>
          </div>
          <div className="col-12">
            <label className="form-label">Amenities</label>
            <div className="d-flex flex-wrap gap-2">
              {amenityOptions.map((option) => (
                <div
                  key={option.label}
                  className="amenity-chip"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: amenities.includes(option.label) ? '2px solid #1f2e3d' : '1px solid #ccc',
                    background: amenities.includes(option.label) ? '#e7f1ff' : '#fff',
                    color: amenities.includes(option.label) ? '#1f2e3d' : '#333',
                    cursor: 'pointer',
                    fontWeight: amenities.includes(option.label) ? 'bold' : 'normal',
                    userSelect: 'none',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handleAmenityChipClick(option.label)}
                >
                  <span style={{ fontSize: '1.2em', marginRight: 8 }}>{option.icon}</span>
                  {option.label}
                </div>
              ))}
            </div>
          </div>
       
          <div className="col-md-4">
            <label htmlFor="instagram" className="form-label">Instagram</label>
            <input type="text" className="form-control" id="instagram" name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram link" />
          </div>
          <div className="col-md-4">
            <label htmlFor="facebook" className="form-label">Facebook</label>
            <input type="text" className="form-control" id="facebook" name="facebook" value={form.facebook} onChange={handleChange} placeholder="Facebook link" />
          </div>
          <div className="col-md-4">
            <label htmlFor="twitter" className="form-label">Twitter</label>
            <input type="text" className="form-control" id="twitter" name="twitter" value={form.twitter} onChange={handleChange} placeholder="Twitter link" />
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
