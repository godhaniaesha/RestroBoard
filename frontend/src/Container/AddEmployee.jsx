import React, { useRef, useState, useEffect } from "react";
import CustomCalendar from "../Component/CustomCalendar";
import CustomSelect from "../Component/CustomSelect";
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";
import XCustomSelect from "../Component/XCustomSelect";

function AddEmployee() {
  const [joiningDate, setJoiningDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [supplierImg, setSupplierImg] = useState(null);
  const [supplierImgPreviewUrl, setSupplierImgPreviewUrl] = useState(null);

  // Effect to clean up the object URL when the component unmounts or image changes
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
    // Optionally reset the file input value to allow re-uploading the same file
    const fileInput = document.getElementById("supplierImgInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const handleDateSelect = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formatted = date.toLocaleDateString("en-GB");
      setJoiningDate(formatted);
      setShowCalendar(false);
    }
  };

  return (
    <>
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Employee Form</h4>

        <div className="x_popup">
          <form
            className={`x_dropzone x_dropzone-multiple  dz-clickable ${
              supplierImg ? "x_has-image" : ""
            }`}
            id="dropzone-multiple"
            data-dropzone="data-dropzone"
            action="#!"
            onClick={() => document.getElementById("supplierImgInput").click()}
            style={{ cursor: "pointer" }}
          >
            {!supplierImg && (
              <div
                className="dz-message x_dz-message"
                data-dz-message="data-dz-message"
                onClick={() =>
                  document.getElementById("supplierImgInput").click()
                }
                style={{ cursor: "pointer" }}
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

          <form className="row g-3 mt-3">
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
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <XCustomSelect
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "manager", label: "Manager" },
                  { value: "supplyer", label: "Supplyer" },
                  { value: "saif", label: "Saif" },
                  { value: "waiter", label: "Waiter" },
                ]}
                value={selectedOption}
                onChange={setSelectedOption}
                placeholder="Select role..."
                name="role"
                id="role"
                required
              />
              <div className="invalid-feedback">Please select a role</div>
            </div>

            <div className="col-md-6" style={{ position: "relative" }}>
              <label htmlFor="joining_date" className="form-label">
                Joining Date
              </label>
              <input
                className="form-control datetimepicker "
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
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                rows="3"
                placeholder="Enter full address"
              ></textarea>
            </div>
            <div className="col-12 d-flex justify-content-center x_btn_main">
              <button type="button" className="btn btn-secondary mx-2">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary mx-2">
                Create
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default AddEmployee;
