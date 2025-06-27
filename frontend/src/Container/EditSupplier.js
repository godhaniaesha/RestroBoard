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

export default function EditSupplier({ setActiveItem }) {
  const dispatch = useDispatch();
  const { singleSupplier, loading, success, error } = useSelector(
    (state) => state.supplier
  );

  const supplierId = localStorage.getItem("editSupplierId");

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

  useEffect(() => {
    if (supplierId) {
      dispatch(getSupplierById(supplierId));
    }
  }, [dispatch, supplierId]);

  useEffect(() => {
    if (singleSupplier) {
      setFormData({
        name: singleSupplier.name || "",
        phone: singleSupplier.phone || "",
        whatsapp_number: singleSupplier.whatsapp_number || "",
        email: singleSupplier.email || "",
        address: singleSupplier.address || "",
        ingredients_supplied: singleSupplier.ingredients_supplied || "",
        role: singleSupplier.role || "supplier",
      });

      if (singleSupplier.supplyer_image) {
        setSupplierImgPreviewUrl(singleSupplier.supplyer_image);
      }
    }
  }, [singleSupplier]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSupplierState());
      localStorage.removeItem("editSupplierId");
      setActiveItem("supplier-list");
    }

    if (error) {
      toast.error(error);
      dispatch(clearSupplierState());
    }
  }, [success, error, dispatch, setActiveItem]);

  const removeSupplierImage = () => {
    setSupplierImg(null);
    if (supplierImgPreviewUrl) {
      URL.revokeObjectURL(supplierImgPreviewUrl);
      setSupplierImgPreviewUrl(null);
    }
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

    const updateData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updateData.append(key, value);
    });

    if (supplierImg) {
      updateData.append("supplyer_image", supplierImg);
    }

    dispatch(updateSupplier({ id: supplierId, data: updateData }));
  };

  return (
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
                &times;
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
            ></textarea>
          </div>

          <div className="col-12 d-flex justify-content-center x_btn_main">
            <button
              type="button"
              className="btn btn-secondary mx-2"
              onClick={() => setActiveItem("supplier-list")}
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
  );
}
