import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createItem, fetchItemById, resetCreateSuccess, updateItem } from "../redux/slice/stockmanage.slice";
import { getAllSuppliers, selectSuppliers } from "../redux/slice/supplier.slice";
import { fetchCategories } from "../redux/slice/category.slice";
import CustomCalendar from "../Component/CustomCalendar";
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";
import XCustomSelect from "../Component/XCustomSelect";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function AddItems({ itemId, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedItem, loading, error, createSuccess, updateSuccess } = useSelector((state) => state.stock);
  const suppliers = useSelector((state) => state.supplier.suppliers);
  const categories = useSelector((state) => state.category.categories);

  const [expiryDate, setExpiryDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Custom select states
  const [category, setCategory] = useState(null);
  const [unit, setUnit] = useState(null);
  const [supplier, setSupplier] = useState(null);
  // Image states (like AddCategory)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // New states for form fields
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minThreshold, setMinThreshold] = useState("");

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

  // Effect to clean up the object URL when the component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(resetCreateSuccess());
      if (onSuccess) onSuccess();
      setImageFile(null);
      setImagePreview(null);
      setItemName("");
      setPrice("");
      setQuantity("");
      setMinThreshold("");
      setCategory(null);
      setUnit(null);
      setSupplier(null);
      setExpiryDate(null);
      navigate('/inventory-stock')
    }
  }, [createSuccess, updateSuccess, dispatch, onSuccess]);

  useEffect(() => {
    dispatch(getAllSuppliers());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (itemId) {
      dispatch(fetchItemById(itemId));
    }
    // Optionally clear form on unmount
    return () => {
      // dispatch(clearSelectedItem()); // If you add this action
    };
  }, [dispatch, itemId]);

  // When selectedItem changes, fill the form
  useEffect(() => {
    if (itemId && selectedItem && selectedItem._id === itemId) {
      setItemName(selectedItem.item_name || "");
      setPrice(selectedItem.price || "");
      setQuantity(selectedItem.quantity || "");
      setMinThreshold(selectedItem.minimum_threshold || "");
      setCategory(selectedItem.category_id
        ? { value: selectedItem.category_id._id, label: selectedItem.category_id.category_name }
        : null
      );
      setUnit(selectedItem.unit
        ? { value: selectedItem.unit, label: selectedItem.unit }
        : null
      );
      setSupplier(selectedItem.supplier_id
        ? { value: selectedItem.supplier_id._id, label: selectedItem.supplier_id.name }
        : null
      );
      setExpiryDate(selectedItem.expiry_date ? new Date(selectedItem.expiry_date) : null);
      // Image preview logic (like AddCategory.js)
      if (selectedItem.item_image) {
        setImagePreview(`http://localhost:3000${selectedItem.item_image}`);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [itemId, selectedItem]);
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('itemImageInput');
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
      setExpiryDate(date);
      setShowCalendar(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Item name validation: letters, numbers, spaces
    if (!/^[A-Za-z0-9 ]+$/.test(itemName)) {
      toast.error('Item name can only contain letters, numbers, and spaces.');
      return;
    }
    if (!itemName.trim()) {
      toast.error('Item name is required.');
      return;
    }
    // Price validation: positive number
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(price) || Number(price) <= 0) {
      toast.error('Price must be a positive number.');
      return;
    }
    // Quantity validation: positive number
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(quantity) || Number(quantity) <= 0) {
      toast.error('Quantity must be a positive number.');
      return;
    }
    // Minimum threshold validation: positive integer
    if (!/^[0-9]+$/.test(minThreshold) || Number(minThreshold) <= 0) {
      toast.error('Minimum threshold must be a positive integer.');
      return;
    }
    // Category validation
    if (!category) {
      toast.error('Category is required.');
      return;
    }
    // Unit validation
    if (!unit) {
      toast.error('Unit is required.');
      return;
    }
    // Supplier validation
    if (!supplier) {
      toast.error('Supplier is required.');
      return;
    }
    if (!itemId && !imageFile) {
      toast.error('Please upload an item image.');
      return;
    }
    const formData = new FormData();
    // Collect all form fields
    formData.append("item_name", itemName);
    formData.append("category_id", category?.value || "");
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("unit", unit?.value || "");
    formData.append("minimum_threshold", minThreshold);
    formData.append(
      "expiry_date",
      expiryDate ? expiryDate.toISOString().split("T")[0] : ""
    );
    formData.append("supplier_id", supplier?.value || "");
    if (imageFile) {
      formData.append("item_image", imageFile);
    }

    if (itemId) {
      dispatch(updateItem({ id: itemId, formData }));
    } else {
      dispatch(createItem(formData));
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <section className="x_employee-section">
        <h4 className="x_employee-heading">{itemId ? "Edit Item" : "Add Item"}</h4>
        <div className="x_popup">
          <div
            className={`x_dropzone x_dropzone-multiple  dz-clickable ${imagePreview ? 'x_has-image' : ''}`}
            onClick={() => !imagePreview && document.getElementById('itemImageInput').click()}
            style={{ cursor: 'pointer' }}
          >
            {!imagePreview && (
              <div className="dz-message x_dz-message">
                <img className="me-2" src={uplod} width="25" alt="upload" />
                Drop your files here
              </div>
            )}
            <input
              id="itemImageInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview x_image-preview">
                <img src={imagePreview} alt="Item" className="x_uploaded-image" />
                <button
                  type="button"
                  className="x_remove-image-btn"
                  onClick={removeImage}
                  title="Remove image"
                >
                  <IoClose />
                </button>
              </div>
            )}
          </div>
          <form className="row g-3 mt-3" onSubmit={handleSubmit}>
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
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                maxLength={50}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <XCustomSelect
                options={categories.map((cat) => ({ value: cat._id, label: cat.category_name }))}
                value={category}
                onChange={setCategory}
                placeholder="Select Category..."
                name="category"
                id="category"
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                placeholder="Enter price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                maxLength={10}
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
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                maxLength={10}
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
                type="text"
                className="form-control"
                id="min_threshold"
                name="min_threshold"
                placeholder="Enter minimum threshold"
                value={minThreshold}
                onChange={e => setMinThreshold(e.target.value)}
                maxLength={5}
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
                value={expiryDate ? expiryDate.toLocaleDateString("en-GB") : ""}
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
                options={(suppliers || []).map((sup) => ({ value: sup._id, label: sup.name }))}
                value={supplier}
                onChange={setSupplier}
                placeholder="Select Supplier..."
                name="supplier_id"
                id="supplier_id"
                required
              />
            </div>

            {error && <div className="col-12 text-danger">{error}</div>}

            <div className="col-12 d-flex justify-content-center x_btn_main">
              <button type="button" className="btn btn-secondary mx-2" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                {loading ? "Saving..." : (itemId ? "Update" : "Create")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default AddItems;