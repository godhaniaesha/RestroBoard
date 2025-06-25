import React, { useRef, useState, useEffect } from "react";
import CustomCalendar from "../Component/CustomCalendar";
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";
import XCustomSelect from "../Component/XCustomSelect";

function AddItems() {
  const [expiryDate, setExpiryDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Custom select states
  const [category, setCategory] = useState(null);
  const [unit, setUnit] = useState(null);
  const [supplier, setSupplier] = useState(null);
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
    const fileInput = document.getElementById('supplierImgInput');
    if (fileInput) {
      fileInput.value = '';
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
      setExpiryDate(formatted);
      setShowCalendar(false);
    }
  };

  return (
    <>
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Add Item Form</h4>

        <div className="x_popup">
          <form
            className={`x_dropzone x_dropzone-multiple  dz-clickable ${supplierImg ? 'x_has-image' : ''}`}
            id="dropzone-multiple"
            data-dropzone="data-dropzone"
            action="#!"
            onClick={() => document.getElementById('supplierImgInput').click()}
            style={{ cursor: 'pointer' }}
          >

            {!supplierImg && (
              <div
                className="dz-message x_dz-message"
                data-dz-message="data-dz-message"
                onClick={() => document.getElementById('supplierImgInput').click()}
                style={{ cursor: 'pointer' }}
              >
                <img className="me-2" src={uplod} width="25" alt="upload" />
                Drop your files here
              </div>


            )}

            <input
              id="supplierImgInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
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
                  &times;
                </button>
              </div>
            )}
          </form>

          <form className="row g-3 mt-3">
            <div className="col-md-6">
              <label htmlFor="itemName" className="form-label">
                Item Name
              </label>
              <input
                type="text"
                className="form-control"
                id="itemName"
                name="itemName"
                placeholder="Enter item name"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <XCustomSelect
                options={[
                  { value: "vegetable", label: "Vegetable" },
                  { value: "fruit", label: "Fruit" },
                  { value: "dairy", label: "Dairy" },
                  { value: "meat", label: "Meat" },
                  { value: "drygoods", label: "Dry Goods" },
                ]}
                value={category}
                onChange={setCategory}
                placeholder="Select Category..."
                name="category"
                id="category"
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                placeholder="Enter quantity"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="unit" className="form-label">
                Unit
              </label>
              <XCustomSelect
                options={[
                  { value: "kg", label: "Kg" },
                  { value: "g", label: "g" },
                  { value: "liter", label: "Liter" },
                  { value: "ml", label: "ml" },
                  { value: "piece", label: "Piece" },
                ]}
                value={unit}
                onChange={setUnit}
                placeholder="Select Unit..."
                name="unit"
                id="unit"
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="min_threshold" className="form-label">
                Minimum Threshold
              </label>
              <input
                type="number"
                className="form-control"
                id="min_threshold"
                name="min_threshold"
                placeholder="Enter minimum threshold"
              />
            </div>

            <div className="col-md-6" style={{ position: "relative" }}>
              <label htmlFor="expiry_date" className="form-label">
                Expiry Date
              </label>
              <input
                className="form-control datetimepicker "
                id="expiry_date"
                type="text"
                placeholder="dd/mm/yyyy"
                value={expiryDate}
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
                    initialDate={expiryDate}
                  />
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="supplier_id" className="form-label">
                Supplier
              </label>
              <XCustomSelect
                options={[
                  { value: "supplier1", label: "Supplier A" },
                  { value: "supplier2", label: "Supplier B" },
                  { value: "supplier3", label: "Supplier C" },
                ]}
                value={supplier}
                onChange={setSupplier}
                placeholder="Select Supplier..."
                name="supplier_id"
                id="supplier_id"
                required
              />
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

export default AddItems;