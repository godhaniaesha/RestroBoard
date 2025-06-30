  import React, { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { createSupplier, clearSupplierState } from "../redux/slice/supplier.slice";
  import { toast } from "react-toastify";
  import uplod from "../Image/cloud-upload.svg";
  import "../Style/x_app.css";
  import { IoClose } from "react-icons/io5";

  export default function AddSupplier() {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
      name: "",
      phone: "",
      whatsapp_number: "",
      email: "",
      address: "",
      ingredients_supplied: "",
      role: "supplyer", // ✅ Default role
    });

    const [supplierImg, setSupplierImg] = useState(null);
    const [supplierImgPreviewUrl, setSupplierImgPreviewUrl] = useState(null);

    const { loading, error, success } = useSelector((state) => state.supplier);

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

        setSupplierImg(null);
        if (supplierImgPreviewUrl) {
          URL.revokeObjectURL(supplierImgPreviewUrl);
          setSupplierImgPreviewUrl(null);
        }

        const fileInput = document.getElementById("supplierImgInput");
        if (fileInput) {
          fileInput.value = "";
        }

        dispatch(clearSupplierState());
      }

      if (error) {
        toast.error(error);
        dispatch(clearSupplierState());
      }
    }, [success, error, dispatch]);

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

      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      if (supplierImg) {
        submitData.append("supplyer_image", supplierImg);
      }

      dispatch(createSupplier(submitData));
    };

    return (
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Add Supplier Form</h4>
        <div className="x_popup">
          <form
            className={`x_dropzone x_dropzone-multiple dz-clickable ${supplierImg ? "x_has-image" : ""}`}
            onClick={() => document.getElementById("supplierImgInput").click()}
            style={{ cursor: "pointer" }}
          >
            {!supplierImg && (
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
            {supplierImg && supplierImgPreviewUrl && (
              <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview x_image-preview">
                <img src={supplierImgPreviewUrl} alt="Supplier" className="x_uploaded-image" />
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
              <label htmlFor="supplierName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="supplierName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter supplier name"
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
    );
  }