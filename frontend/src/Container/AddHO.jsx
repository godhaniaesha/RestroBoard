import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createHotel, getAllHotel, updateHotel } from "../redux/slice/hotel.slice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uplod from "../Image/cloud-upload.svg";
import "../Style/x_app.css";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function AddHO() {
  const navigate = useNavigate();
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

    if (!/^[A-Za-z0-9 ]+$/.test(form.name)) {
      toast.error('Hotel name can only contain letters, numbers, and spaces.');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Hotel name is required.');
      return;
    }
    if (!/^[A-Za-z0-9 ,.()!"'\-]+$/.test(form.description)) {
      toast.error('Description contains invalid characters.');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required.');
      return;
    }
    if (!/^[A-Za-z0-9 ,.()!"'\-]+$/.test(form.address)) {
      toast.error('Address contains invalid characters.');
      return;
    }
    if (!form.address.trim()) {
      toast.error('Address is required.');
      return;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }
    if (!form.phone.trim()) {
      toast.error('Phone is required.');
      return;
    }
    if (!/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9\-.]+)\.([a-zA-Z]{2,})$/.test(form.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!form.email.trim()) {
      toast.error('Email is required.');
      return;
    }
    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/i;
    if (form.instagram && !urlPattern.test(form.instagram)) {
      toast.error('Instagram link is not a valid URL.');
      return;
    }
    if (form.facebook && !urlPattern.test(form.facebook)) {
      toast.error('Facebook link is not a valid URL.');
      return;
    }
    if (form.twitter && !urlPattern.test(form.twitter)) {
      toast.error('Twitter link is not a valid URL.');
      return;
    }

    if (!existingHotelId && !supplierImg) {
      toast.error('Please upload a hotel image.');
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
      navigate("/hotel-information");
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
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <section className="x_employee-section">
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
                      if (!validateImage(file)) {
                        e.target.value = '';
                        return;
                      }
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
                  maxLength={
                    name === "name" ? 50 :
                    name === "phone" ? 10 :
                    name === "email" ? 100 :
                    name === "address" ? 200 :
                    100
                  }
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
                maxLength={500}
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
                  maxLength={100}
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
    </>
  );
}
