import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSupplierById,
  updateSupplier,
  clearSupplierState,
} from "../redux/slice/supplier.slice";
import { toast } from "react-toastify";
import uplod from "../Image/cloud-upload.svg";
import "../Style/x_app.css";
import Spinner from "../Spinner";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

export default function EditSupplier({ setActiveItem}) {
  const params = new URLSearchParams(window.location.search);
    const propSupplierId = params?._id || null;
    console.log("propSupplierId:", propSupplierId);
    
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { supplierData, loading, success, error } = useSelector(
    (state) => state.supplier
  );

  const supplierId = propSupplierId || localStorage.getItem("supplierId-local");

  useEffect(() => {
    if (propSupplierId) {
      localStorage.setItem("editSupplierId", propSupplierId);
    }
  }, [propSupplierId]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp_number: "",
    email: "",
    address: "",
    ingredients_supplied: "",
    role: "supplier",
  });

  const [supplierImg, setSupplierImg] = useState(null);
  const [supplierImgPreviewUrl, setSupplierImgPreviewUrl] = useState(null);

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
    if (supplierId) {
      dispatch(getSupplierById(supplierId));
    }
  }, [dispatch, supplierId]);

  useEffect(() => {
    if (supplierData) {
      setFormData({
        name: supplierData.name || "",
        phone: supplierData.phone || "",
        whatsapp_number: supplierData.whatsapp_number || "",
        email: supplierData.email || "",
        address: supplierData.address || "",
        ingredients_supplied: Array.isArray(supplierData.ingredients_supplied)
          ? supplierData.ingredients_supplied.join(", ")
          : (supplierData.ingredients_supplied || ""),
        role: supplierData.role || "supplier",
      });

      // Show backend image only if new image isn't selected
      if (supplierData.supplyer_image && !supplierImg) {
        setSupplierImgPreviewUrl(`http://localhost:3000${supplierData.supplyer_image}`);
      }
    }
  }, [supplierData]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSupplierState());
      setSupplierImg(null);
      setSupplierImgPreviewUrl(null);
      localStorage.removeItem("editSupplierId");
      navigate("/supplier-list");
    }

    if (error) {
      toast.error(error);
      dispatch(clearSupplierState());
    }
  }, [success, error, dispatch, navigate]);

  const removeSupplierImage = () => {
    setSupplierImg(null);
    setSupplierImgPreviewUrl(null);
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
    const ingredientsSupplied = typeof formData.ingredients_supplied === "string"
      ? formData.ingredients_supplied
      : String(formData.ingredients_supplied);
    if (!/^[A-Za-z0-9 ,.()!"'\-]+$/.test(ingredientsSupplied)) {
      toast.error('Ingredients supplied contains invalid characters.');
      return;
    }
    if (!ingredientsSupplied.trim()) {
      toast.error('Ingredients supplied is required.');
      return;
    }

    const updateData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updateData.append(key, value);
    });

    if (supplierImg) {
      updateData.append("supplyer_image", supplierImg);
    }

    dispatch(updateSupplier({ id: supplierId, data: updateData }));
  };

  // Show spinner when loading on first fetch or during update
  if (loading && !supplierData) {
    return <Spinner />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Edit Supplier</h4>
        <div className="x_popup">
          <form
            className={`x_dropzone x_dropzone-multiple dz-clickable ${
              supplierImgPreviewUrl ? "x_has-image" : ""
            }`}
            onClick={() => document.getElementById("supplierImgInput").click()}
            style={{ cursor: "pointer" }}
          >
            {!supplierImgPreviewUrl && (
              <div
                className="dz-message x_dz-message"
                onClick={() => document.getElementById("supplierImgInput").click()}
              >
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
                  if (!validateImage(file)) {
                    e.target.value = '';
                    return;
                  }
                  setSupplierImg(file);
                  setSupplierImgPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
            {supplierImgPreviewUrl && (
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
                  <IoClose />
                  {/* &times; */}
                </button>
              </div>
            )}
          </form>

          <form className="row g-3 mt-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter supplier name"
                maxLength={50}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                maxLength={10}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                maxLength={100}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">WhatsApp Number</label>
              <input
                type="tel"
                className="form-control"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="Enter WhatsApp number"
                maxLength={10}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                maxLength={200}
              ></textarea>
            </div>

            <div className="col-12">
              <label className="form-label">Ingredients Supplied</label>
              <textarea
                className="form-control"
                name="ingredients_supplied"
                rows="3"
                value={formData.ingredients_supplied}
                onChange={handleChange}
                placeholder="e.g., Flour, Tomatoes, Olive Oil"
                maxLength={200}
              ></textarea>
            </div>

            <div className="col-12 d-flex justify-content-center x_btn_main">
              <button
                type="button"
                className="btn btn-secondary mx-2"
                onClick={() => {
                  localStorage.removeItem("editSupplierId");
                  navigate("supplier-list");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary mx-2"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
