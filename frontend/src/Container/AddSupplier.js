import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSupplier,
  updateSupplier,
  getSupplierById,
  clearSuccess,
} from '../redux/slice/supplier.slice';
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";

export default function AddSupplier({ supplierId, onNavigate }) {
  const dispatch = useDispatch();
  const isEditMode = Boolean(supplierId);
  const { loading, error, success } = useSelector((state) => state.supplier);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    whatsapp_number: '',
    address: '',
    ingredients_supplied: '',
  });
  const [supplierImg, setSupplierImg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Clear any stale success flag on mount
  useEffect(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  // Fetch supplier data in edit mode
  useEffect(() => {
    if (isEditMode && supplierId) {
      dispatch(getSupplierById(supplierId))
        .unwrap()
        .then((data) => {
          setForm({
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || '',
            whatsapp_number: data.whatsapp_number || '',
            address: data.address || '',
            ingredients_supplied: Array.isArray(data.ingredients_supplied)
              ? data.ingredients_supplied.join(', ')
              : (data.ingredients_supplied || ''),
          });
          if (data.supplyer_image) {
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            setImagePreview(`${base}${data.supplyer_image.startsWith('/') ? '' : '/'}${data.supplyer_image}`);
          } else {
            setImagePreview(null);
          }
          setSupplierImg(null);
        })
        .catch((err) => console.error('Unable to load supplier:', err));
    } else {
      setForm({
        name: '',
        phone: '',
        email: '',
        whatsapp_number: '',
        address: '',
        ingredients_supplied: '',
      });
      setImagePreview(null);
      setSupplierImg(null);
    }
  }, [dispatch, supplierId, isEditMode]);

  // On success, navigate back to supplier list
  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
      if (onNavigate) onNavigate('supplier-list');
    }
  }, [success, dispatch, onNavigate]);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSupplierImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSupplierImg(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    const fileInput = document.getElementById('supplierImgInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ingredientsArray = form.ingredients_supplied
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const supplierData = { ...form, ingredients_supplied: ingredientsArray };
    if (supplierImg) {
      supplierData.supplyer_image = supplierImg;
    }
    if (isEditMode) {
      dispatch(updateSupplier({ id: supplierId, supplierData }));
    } else {
      dispatch(createSupplier(supplierData));
    }
  };

  return (
    <section className="x_employee-section">
      <h4 className="x_employee-heading">{isEditMode ? 'Edit Supplier' : 'Add Supplier'} Form</h4>
      <div className="x_popup">
        <div
          className={`x_dropzone x_dropzone-multiple dz-clickable ${imagePreview ? 'x_has-image' : ''}`}
          onClick={() => document.getElementById('supplierImgInput').click()}
          style={{ cursor: 'pointer' }}
        >
          {!imagePreview && (
            <div className="dz-message x_dz-message">
              <img className="me-2" src={uplod} width="25" alt="upload" />
              Drop your files here
            </div>
          )}
          <input
            id="supplierImgInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview x_image-preview">
              <img src={imagePreview} alt="Supplier" className="x_uploaded-image" />
              <button
                type="button"
                className="x_remove-image-btn"
                onClick={removeImage}
                title="Remove image"
              >
                &times;
              </button>
            </div>
          )}
        </div>
        <form className="row g-3 mt-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="supplierName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="supplierName"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter supplier name"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="whatsapp_number" className="form-label">WhatsApp Number</label>
            <input
              type="tel"
              className="form-control"
              id="whatsapp_number"
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={handleChange}
              placeholder="Enter WhatsApp number"
            />
          </div>
          <div className="col-12">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter full address"
            />
          </div>
          <div className="col-12">
            <label htmlFor="ingredients_supplied" className="form-label">Ingredients Supplied</label>
            <textarea
              className="form-control"
              id="ingredients_supplied"
              name="ingredients_supplied"
              value={form.ingredients_supplied}
              onChange={handleChange}
              rows="3"
              placeholder="e.g., Flour, Tomatoes, Olive Oil"
            />
          </div>
          {error && (
            <div className="col-12 text-danger">{typeof error === 'string' ? error : 'Something went wrong'}</div>
          )}
          <div className="col-12 d-flex justify-content-center x_btn_main">
            <button
              type="button"
              className="btn btn-secondary mx-2"
              onClick={() => onNavigate('supplier-list')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary mx-2"
              disabled={loading}
            >
              {loading ? 'Saving…' : (isEditMode ? 'Update Supplier' : 'Create Supplier')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
