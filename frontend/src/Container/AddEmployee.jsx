import React, { useRef, useState, useEffect } from "react";
import CustomCalendar from "../Component/CustomCalendar";
import CustomSelect from "../Component/CustomSelect";
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";

function AddEmployee() {
  const [joiningDate, setJoiningDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

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
            className="x_dropzone x_dropzone-multiple  dz-clickable"
            id="dropzone-multiple"
            data-dropzone="data-dropzone"
            action="#!"
          >
            <div
              className="dz-message x_dz-message"
              data-dz-message="data-dz-message"
            >
              <img
                className="me-2"
                src={uplod}
                width="25"
                alt="upload"
              />
              Drop your files here
            </div>

            <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview"></div>
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
              <CustomSelect />
              <div className="invalid-feedback">Please select one</div>
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
                <div ref={calendarRef} style={{ position: "absolute", zIndex: 10, top: "100%", left: 0 }}>
                  <CustomCalendar onDateSelect={handleDateSelect} initialDate={joiningDate} />
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
              <button type="button" className="btn btn-secondary mx-2">Cancel</button>
              <button type="submit" className="btn btn-primary mx-2">Create</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default AddEmployee;
