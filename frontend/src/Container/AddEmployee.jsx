import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRegister,
  getRegisterById,
  updateProfileUser,
  clearSuccess,
} from "../redux/slice/user.slice.js";
import XCustomSelect from "../Component/XCustomSelect";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";

function AddEmployee({ employeeId, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    success,
    userData: selectedEmployee,
  } = useSelector((state) => state.user);
  const isEditMode = Boolean(employeeId);

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    role: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { value: "manager", label: "Manager" },
    { value: "saif", label: "Chef" },
    { value: "waiter", label: "Waiter" },
  ];

  // Fetch employee data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(getRegisterById(employeeId));
    }
  }, [dispatch, employeeId, isEditMode]);

  // Pre-fill form when employee data is loaded
  useEffect(() => {
    if (isEditMode && selectedEmployee && selectedEmployee._id === employeeId) {
      setFormState({
        firstName: selectedEmployee.firstName || "",
        lastName: selectedEmployee.lastName || "",
        email: selectedEmployee.email || "",
        phone: selectedEmployee.phone || "",
        password: "", // Password is not edited here
        address: selectedEmployee.address || "",
        role:
          roleOptions.find((r) => r.value === selectedEmployee.role) || null,
      });
      if (selectedEmployee.image) {
        setImagePreviewUrl(`http://localhost:3000${selectedEmployee.image}`);
      } else {
        setImagePreviewUrl(null);
      }
      setImageFile(null);
    }
  }, [isEditMode, selectedEmployee, employeeId]);

  // Handle success after creating or updating
  useEffect(() => {
    if (success) {
      alert(
        isEditMode
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );
      dispatch(clearSuccess());
      if (!isEditMode) {
        // Reset form after create
        setFormState({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          address: "",
          role: null,
        });
        setImageFile(null);
        setImagePreviewUrl(null);
        const fileInput = document.getElementById("imageInput");
        if (fileInput) fileInput.value = "";
      }
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [success, dispatch, onSuccess, isEditMode]);

  // Clean up object URL for image preview
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const removeImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRoleChange = (selectedOption) => {
    setFormState((prevState) => ({ ...prevState, role: selectedOption }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.role) {
      alert("Please select a role.");
      return;
    }
    if (!isEditMode && !formState.password) {
      alert("Password is required for new employees.");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", formState.firstName);
    formData.append("lastName", formState.lastName);
    formData.append("email", formState.email);
    formData.append("phone", formState.phone);
    formData.append("address", formState.address);
    formData.append("role", formState.role.value);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (isEditMode) {
      dispatch(updateProfileUser({ id: employeeId, formData }));
    } else {
      formData.append("password", formState.password);
      dispatch(createRegister(formData));
    }
  };

  return (
    <>
      <section className="x_employee-section">
        <h4 className="x_employee-heading">
          {isEditMode ? "Edit Employee" : "Add Employee"} Form
        </h4>
        <div className="x_popup">
          <div
            className={`x_dropzone x_dropzone-multiple dz-clickable ${
              imagePreviewUrl ? "x_has-image" : ""
            }`}
            onClick={() => document.getElementById("imageInput").click()}
            style={{ cursor: "pointer" }}
          >
            {!imagePreviewUrl && (
              <div
                className="dz-message x_dz-message"
                data-dz-message="data-dz-message"
              >
                <img className="me-2" src={uplod} width="25" alt="upload" />
                Drop image here
              </div>
            )}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {imagePreviewUrl && (
              <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview x_image-preview">
                <img
                  src={imagePreviewUrl}
                  alt="Employee"
                  className="x_uploaded-image"
                />
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
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={formState.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={formState.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formState.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            {!isEditMode && (
              <div className="col-md-6">
                <label htmlFor="password" className="form-label X_form">
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formState.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-0 h-100 d-flex align-items-center pe-3"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      border: "none",
                      background: "transparent",
                      zIndex: 10,
                    }}
                  >
                    {showPassword ? (
                      <FaEye color="gray" />
                    ) : (
                      <FaEyeSlash color="gray" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="col-md-6">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <XCustomSelect
                options={roleOptions}
                value={formState.role}
                onChange={handleRoleChange}
                placeholder="Select role..."
                name="role"
                id="role"
                required
              />
            </div>

            <div className="col-12">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                rows="3"
                placeholder="Enter full address"
                value={formState.address}
                onChange={handleInputChange}
              ></textarea>
            </div>

            {error && <div className="col-12 text-danger">{error}</div>}

            <div className="col-12 d-flex justify-content-center x_btn_main">
              <button
                type="button"
                className="btn btn-secondary mx-2"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary mx-2"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Employee"
                  : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default AddEmployee;
