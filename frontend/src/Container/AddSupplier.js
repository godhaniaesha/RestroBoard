  import React, { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { createSupplier, clearSupplierState } from "../redux/slice/supplier.slice";
  import { toast } from "react-toastify";
  import uplod from "../Image/cloud-upload.svg";
  import "../Style/x_app.css";
  import { IoClose } from "react-icons/io5";
  import { ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function AddSupplier() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp_number: "",
    email: "",
    address: "",
    ingredients_supplied: "",
    role: "supplyer",
  });

  // Refactored image logic (like AddCategory)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { loading, error, success } = useSelector((state) => state.supplier);

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_IMAGE_TYPES = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    const validateImage = (file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error('Only JPG, PNG, GIF, or WEBP images are allowed.');
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error('Image size should not exceed 2MB.');
        return false;
      }
      return true;
    };

    useEffect(() => {
      if (success) {
        toast.success(success);
        // ✅ Reset form
        setFormData({
          name: "",
          phone: "",
          whatsapp_number: "",
          email: "",
          address: "",
          ingredients_supplied: "",
          role: "supplyer",
        });
        setImageFile(null);
        setImagePreview(null);
        const fileInput = document.getElementById("supplierImgInput");
        if (fileInput) {
          fileInput.value = "";
        }
        navigate('/supplier-list');
        dispatch(clearSupplierState());
      }
      if (error) {
        toast.error(error);
        dispatch(clearSupplierState());
      }
    }, [success, error, dispatch]);

    useEffect(() => {
      return () => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }
      };
    }, [imagePreview]);

    const removeImage = () => {
      setImageFile(null);
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      const fileInput = document.getElementById("supplierImgInput");
      if (fileInput) {
        fileInput.value = "";
      }
    };

    const handleChange = (e) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (!validateImage(file)) {
          e.target.value = '';
          return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!/^[A-Za-z ]+$/.test(formData.name)) {
        toast.error('Supplier name can only contain letters and spaces.');
        return;
      }
      if (!formData.name.trim()) {
        toast.error('Supplier name is required.');
        return;
      }
      if (!/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9\-.]+)\.([a-zA-Z]{2,})$/.test(formData.email)) {
        toast.error('Please enter a valid email address.');
        return;
      }
      if (!formData.email.trim()) {
        toast.error('Email is required.');
        return;
      }
      if (!/^[0-9]{10}$/.test(formData.phone)) {
        toast.error('Phone number must be exactly 10 digits.');
        return;
      }
      if (!formData.phone.trim()) {
        toast.error('Phone is required.');
        return;
      }
      if (formData.whatsapp_number && !/^[0-9]{10}$/.test(formData.whatsapp_number)) {
        toast.error('WhatsApp number must be exactly 10 digits.');
        return;
      }
      if (!/^[A-Za-z0-9 ,.()!"'\-]+$/.test(formData.address)) {
        toast.error('Address contains invalid characters.');
        return;
      }
      if (!formData.address.trim()) {
        toast.error('Address is required.');
        return;
      }
      if (!/^[A-Za-z0-9 ,.()!"'\-]+$/.test(formData.ingredients_supplied)) {
        toast.error('Ingredients supplied contains invalid characters.');
        return;
      }
      if (!formData.ingredients_supplied.trim()) {
        toast.error('Ingredients supplied is required.');
        return;
      }
      if (!imageFile) {
        toast.error('Please upload a supplier image.');
        return;
      }
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      if (imageFile) {
        submitData.append("supplyer_image", imageFile);
      }
      dispatch(createSupplier(submitData));
    };

    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <section className="x_employee-section">
          <h4 className="x_employee-heading">Add Supplier Form</h4>
          <div className="x_popup">
            <div
              className={`x_dropzone x_dropzone-multiple dz-clickable ${imagePreview ? "x_has-image" : ""}`}
              onClick={() => !imagePreview && document.getElementById("supplierImgInput").click()}
              style={{ cursor: "pointer" }}
            >
              {!imagePreview && (
                <div
                  className="dz-message x_dz-message"
                  onClick={() => document.getElementById("supplierImgInput").click()}
                >
                  <img className="me-2" src={uplod} width="25" alt="upload" />
                  Drop your files here
                </div>
              )}
              {!imagePreview && (
                <input
                  id="supplierImgInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              )}
              {imagePreview && (
                <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview x_image-preview">
                  <img src={imagePreview} alt="Supplier" className="x_uploaded-image" />
                  <button
                    type="button"
                    className="x_remove-image-btn"
                    onClick={removeImage}
                    title="Remove image"
                  >
                    <IoClose />
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
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                  maxLength={50}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  maxLength={10}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  maxLength={100}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="whatsapp" className="form-label">WhatsApp Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="whatsapp"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  maxLength={10}
                />
              </div>

              <div className="col-12" style={{ paddingRight: '8px', paddingLeft: '8px' }}>
                <label htmlFor="address" className="form-label">Address</label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  maxLength={200}
                ></textarea>
              </div>

              <div className="col-12">
                <label htmlFor="ingredients_supplied" className="form-label">Ingredients Supplied</label>
                <textarea
                  className="form-control"
                  id="ingredients_supplied"
                  name="ingredients_supplied"
                  rows="3"
                  value={formData.ingredients_supplied}
                  onChange={handleChange}
                  placeholder="e.g., Flour, Tomatoes, Olive Oil"
                  maxLength={200}
                ></textarea>
              </div>

              <div className="col-12 d-flex justify-content-center x_btn_main">
                <button type="button" className="btn btn-secondary mx-2" onClick={() => window.location.reload()}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </>
    );
  }
