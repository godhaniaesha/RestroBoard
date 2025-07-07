import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRegisterById,
  updateProfileUser,
} from "../redux/slice/user.slice";
import CustomCalendar from "../Component/CustomCalendar";
import XCustomSelect from "../Component/XCustomSelect";
import uplod from "../Image/cloud-upload.svg";
import "../Style/x_app.css";
import Spinner from "../Spinner";
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';

function EditEmployee() {
  const dispatch = useDispatch();
  const employeeId = localStorage.getItem("editEmployeeId");
  const { userData, loading } = useSelector((state) => state.user);

  const [joiningDate, setJoiningDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [supplierImg, setSupplierImg] = useState(null);
  const [supplierImgPreviewUrl, setSupplierImgPreviewUrl] = useState(null);
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  useEffect(() => {
    if (employeeId) dispatch(getRegisterById(employeeId));
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (userData && userData._id === employeeId) {
      if (userData.joining_Date) {
        const date = new Date(userData.joining_Date);
        const formatted = date.toLocaleDateString("en-GB");
        setJoiningDate(formatted);
      }

      setSelectedOption({
        value: userData.role,
        label: userData.role,
      });

      if (userData.image) {
        setSupplierImgPreviewUrl(userData.image);
      }
    }
  }, [userData, employeeId]);

  useEffect(() => {
    return () => {
      if (supplierImgPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(supplierImgPreviewUrl);
      }
    };
  }, [supplierImgPreviewUrl]);

  const removeSupplierImage = () => {
    setSupplierImg(null);
    if (supplierImgPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(supplierImgPreviewUrl);
    }
    setSupplierImgPreviewUrl(null);
    const fileInput = document.getElementById("supplierImgInput");
    if (fileInput) fileInput.value = "";
  };

  const handleDateSelect = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formatted = date.toLocaleDateString("en-GB");
      setJoiningDate(formatted);
      setShowCalendar(false);
    }
  };

  const formatDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`).toISOString();
  };

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const firstNameValue = document.getElementById("firstName").value.trim();
    const lastNameValue = document.getElementById("lastName").value.trim();
    if (!/^[A-Za-z ]+$/.test(firstNameValue)) {
      toast.error('First name can only contain letters and spaces.');
      return;
    }
    if (!/^[A-Za-z ]+$/.test(lastNameValue)) {
      toast.error('Last name can only contain letters and spaces.');
      return;
    }
    if (!document.getElementById("firstName").value.trim()) {
      toast.error('First name is required.');
      return;
    }
    if (!document.getElementById("lastName").value.trim()) {
      toast.error('Last name is required.');
      return;
    }
    const emailValue = document.getElementById("email").value.trim();
    if (!/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9\-.]+)\.([a-zA-Z]{2,})$/.test(emailValue)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!document.getElementById("email").value.trim()) {
      toast.error('Email is required.');
      return;
    }
    const phoneValue = document.getElementById("phone").value.trim();
    if (!/^[0-9]{10}$/.test(phoneValue)) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }
    if (!document.getElementById("phone").value.trim()) {
      toast.error('Phone is required.');
      return;
    }
    const addressValue = document.getElementById("address").value.trim();
    if (!/^[A-Za-z0-9 ,.()!"'\-]+$/.test(addressValue)) {
      toast.error('Address contains invalid characters.');
      return;
    }
    if (!addressValue) {
      toast.error('Address is required.');
      return;
    }
    if (!selectedOption) {
      toast.error('Role is required.');
      return;
    }
    if (!joiningDate) {
      toast.error('Joining date is required.');
      return;
    }

    const formData = new FormData();
    formData.append("firstName", document.getElementById("firstName").value);
    formData.append("lastName", document.getElementById("lastName").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("role", selectedOption?.value || "");
    formData.append("joining_Date", formatDateToISO(joiningDate));

    if (supplierImg) {
      formData.append("image", supplierImg);
    }

    const result = await dispatch(updateProfileUser({ id: employeeId, formData }));

    if (updateProfileUser.fulfilled.match(result)) {
      dispatch(getRegisterById(employeeId)); // reload updated data
      // Optionally show toast or redirect
    } else {
      console.error("Update failed:", result);
    }
  };

  if (loading || !userData) return  <Spinner></Spinner>;

  return (
    <section className="x_employee-section">
      <h4 className="x_employee-heading">Edit Employee</h4>

      <div className="x_popup">
        <form
          className={`x_dropzone x_dropzone-multiple dz-clickable ${
            supplierImg || supplierImgPreviewUrl ? "x_has-image" : ""
          }`}
          id="dropzone-multiple"
          onClick={() => document.getElementById("supplierImgInput").click()}
        >
          {!supplierImg && !supplierImgPreviewUrl && (
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

        <form className="row g-3 mt-3" onSubmit={handleUpdate}>
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              defaultValue={userData.firstName || ""}
              name="firstName"
              maxLength={30}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              defaultValue={userData.lastName || ""}
              name="lastName"
              maxLength={30}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              defaultValue={userData.email || ""}
              name="email"
              maxLength={100}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              defaultValue={userData.phone || ""}
              name="phone"
              maxLength={10}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="role" className="form-label">Role</label>
            <XCustomSelect
              options={[
                { value: "Manager", label: "Manager" },
                { value: "Stylist", label: "Stylist" },
                { value: "Receptionist", label: "Receptionist" },
              ]}
              value={selectedOption}
              onChange={setSelectedOption}
              placeholder="Select role..."
              name="role"
              id="role"
            />
          </div>

          <div className="col-md-6" style={{ position: "relative" }}>
            <label htmlFor="joining_date" className="form-label">Joining Date</label>
            <input
              className="form-control datetimepicker"
              id="joining_date"
              type="text"
              placeholder="dd/mm/yyyy"
              value={joiningDate}
              readOnly
              ref={inputRef}
              onClick={() => setShowCalendar(true)}
            />
            {showCalendar && (
              <div
                ref={calendarRef}
                style={{
                  position: "absolute",
                  zIndex: 10,
                  top: "100%",
                  left: 0,
                }}
              >
                <CustomCalendar
                  onDateSelect={handleDateSelect}
                  initialDate={joiningDate}
                />
              </div>
            )}
          </div>

          <div className="col-12">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              rows="3"
              defaultValue={userData.address || ""}
              maxLength={200}
            />
          </div>

          <div className="col-12 d-flex justify-content-center x_btn_main">
            <button type="button" className="btn btn-secondary mx-2">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditEmployee;
