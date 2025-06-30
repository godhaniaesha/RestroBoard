import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createHotel, getAllHotel, updateHotel } from "../redux/slice/hotel.slice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uplod from "../Image/cloud-upload.svg";
import "../Style/x_app.css";
import { IoClose } from "react-icons/io5";

export default function AddHO({ onNavigate }) {
  const dispatch = useDispatch();
  const { hotels } = useSelector((state) => state.hotel);

  const [existingHotelId, setExistingHotelId] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [supplierImg, setSupplierImg] = useState(null);
  const [supplierImgPreviewUrl, setSupplierImgPreviewUrl] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    twitter: "",
  });

  const amenityOptions = [
    { label: "Free Wi-Fi", icon: "📶" },
    { label: "Swimming Pool", icon: "🏊" },
    { label: "24/7 Service", icon: "⏰" },
    { label: "Free Parking", icon: "🅿️" },
  ];

  useEffect(() => {
    dispatch(getAllHotel());
  }, [dispatch]);

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      const hotel = hotels[0];
      setExistingHotelId(hotel._id);
      setForm({
        name: hotel.hotel_name || "",
        description: hotel.description || "",
        address: hotel.address || "",
        phone: hotel.phone || "",
        email: hotel.email || "",
        instagram: hotel.instagram || "",
        facebook: hotel.facebook || "",
        twitter: hotel.twitter || "",
      });
      if (hotel.amenities?.length) {
        try {
          setAmenities(JSON.parse(hotel.amenities[0]));
        } catch {
          setAmenities([]);
        }
      }
      if (hotel.hotel_image) {
        setSupplierImgPreviewUrl(`http://localhost:3000${hotel.hotel_image}`);
      }
    }
  }, [hotels]);

  useEffect(() => {
    return () => {
      if (supplierImgPreviewUrl && supplierImgPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(supplierImgPreviewUrl);
      }
    };
  }, [supplierImgPreviewUrl]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.address || !form.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("hotel_name", form.name);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("address", form.address);
    formData.append("description", form.description);
    formData.append("instagram", form.instagram);
    formData.append("facebook", form.facebook);
    formData.append("twitter", form.twitter);
    formData.append("amenities", JSON.stringify(amenities));
    if (supplierImg) {
      formData.append("hotel_image", supplierImg);
    }

    try {
      if (existingHotelId) {
        formData.append("_id", existingHotelId);
        await dispatch(updateHotel({ id: existingHotelId, data: formData })).unwrap();

        toast.success("Hotel updated successfully!");
      } else {
        await dispatch(createHotel(formData)).unwrap();
        toast.success("Hotel created successfully!");
      }
      onNavigate("hotel-information");
    } catch (error) {
      toast.error(error?.message || "Failed to save hotel.");
    }
  };

  const removeSupplierImage = () => {
    setSupplierImg(null);
    if (supplierImgPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(supplierImgPreviewUrl);
    }
    setSupplierImgPreviewUrl(null);
    const fileInput = document.getElementById("supplierImgInput");
    if (fileInput) fileInput.value = "";
  };

  return (
    <section className="x_employee-section">
      <ToastContainer position="top-right" autoClose={3000} />
      <h4 className="x_employee-heading">
        {existingHotelId ? "Edit Hotel Information" : "Add Hotel Information"}
      </h4>

      <div className="x_popup">
        <form className="row g-3 mt-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Hotel Image</label>
            <form
              className={`x_dropzone dz-clickable ${supplierImg || supplierImgPreviewUrl ? "x_has-image" : ""}`}
              onClick={() => document.getElementById("supplierImgInput").click()}
              style={{ cursor: "pointer" }}
            >
              {!supplierImg && !supplierImgPreviewUrl && (
                <div className="dz-message x_dz-message">
                  <img src={uplod} width="25" alt="upload" className="me-2" />
                  Drop your files here
                </div>
              )}
              <input
                id="supplierImgInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSupplierImg(file);
                    setSupplierImgPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
              {(supplierImgPreviewUrl || supplierImg) && (
                <div className="dz-preview d-flex flex-column x_dz-preview x_image-preview">
                  <img src={supplierImgPreviewUrl} alt="Supplier" className="x_uploaded-image" />
                  <button type="button" className="x_remove-image-btn" onClick={removeSupplierImage}>
                    <IoClose />
                    {/* &times; */}
                  </button>
                </div>
              )}
            </form>
          </div>

          {[{ label: "Hotel Name", name: "name" }, { label: "Phone", name: "phone" }, { label: "Email", name: "email", type: "email" }, { label: "Address", name: "address" }].map(({ label, name, type = "text" }) => (
            <div className="col-md-6" key={name}>
              <label htmlFor={name} className="form-label">{label}</label>
              <input
                type={type}
                className="form-control"
                id={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                required
              />
            </div>
          ))}

          <div className="col-12">
            <label htmlFor="description" className="form-label">Description/About</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your hotel..."
              required
            ></textarea>
          </div>

          <div className="col-12">
            <label className="form-label">Amenities</label>
            <div className="d-flex flex-wrap gap-2">
              {amenityOptions.map((option) => (
                <div
                  key={option.label}
                  className="amenity-chip"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "25px",
                    border: amenities.includes(option.label) ? "1.5px solid #1f2e3d" : "1px solid #ccc",
                    background: amenities.includes(option.label) ? "#e7f1ff" : "#fff",
                    color: amenities.includes(option.label) ? "#1f2e3d" : "#333",
                    cursor: "pointer",
                    fontWeight: amenities.includes(option.label) ? "bold" : "normal",
                    transition: "all 0.2s",
                  }}
                  onClick={() => handleAmenityChipClick(option.label)}
                >
                  <span style={{ fontSize: "1.2em", marginRight: 8 }}>{option.icon}</span>
                  {option.label}
                </div>
              ))}
            </div>
          </div>

          {["instagram", "facebook", "twitter"].map((platform) => (
            <div className="col-md-4" key={platform}>
              <label htmlFor={platform} className="form-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
              <input
                type="text"
                className="form-control"
                id={platform}
                name={platform}
                value={form[platform]}
                onChange={handleChange}
                placeholder={`${platform} link`}
              />
            </div>
          ))}

          <div className="col-12 d-flex justify-content-center x_btn_main">
            <button type="button" className="btn btn-secondary mx-2">Cancel</button>
            <button type="submit" className="btn btn-primary mx-2">
              {existingHotelId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
