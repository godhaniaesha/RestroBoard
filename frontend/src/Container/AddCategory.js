import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCategory,
  getCategoryById,
  updateCategory,
  resetUpdateSuccess,
  clearSelectedCategory,
  resetCreateSuccess
} from '../redux/slice/category.slice';
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddCategory({ categoryId }) {
  const navigate = useNavigate();
  // const params = new URLSearchParams(window.location.search);

  const id = categoryId;
  const dispatch = useDispatch();

  const isEditMode = Boolean(id);
  const { loading, error, createSuccess, updateSuccess, selectedCategory } = useSelector((state) => state.category);

  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
    if (isEditMode && id) {
      dispatch(getCategoryById(id));
    }
    return () => {
      dispatch(clearSelectedCategory());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && selectedCategory && selectedCategory._id === id) {
      console.log('Edit form loaded with data:', selectedCategory);
      setCategoryName(selectedCategory.category_name || '');
      setCategoryDescription(selectedCategory.category_description || '');
      if (selectedCategory.category_image) {
        setImagePreview(`http://localhost:3000${selectedCategory.category_image}`);
      } else {
        setImagePreview(null);
      }
    }
  }, [selectedCategory, isEditMode, id]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(resetUpdateSuccess());
      navigate('/category-list');
    }
    if (createSuccess) {
      dispatch(resetCreateSuccess());
      navigate('/category-list');
    }
  }, [createSuccess, updateSuccess, navigate, dispatch]);


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!validateImage(file)) {
        e.target.value = '';
        return;
      }
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
    const fileInput = document.getElementById('categoryImageInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[A-Za-z ]+$/.test(categoryName)) {
      toast.error('Category name can only contain letters and spaces.');
      return;
    }
    if (!categoryName.trim()) {
      toast.error('Category name is required.');
      return;
    }
    if (!/^[A-Za-z0-9 ,.()!"'\-]+$/.test(categoryDescription)) {
      toast.error('Category description contains invalid characters.');
      return;
    }
    if (!categoryDescription.trim()) {
      toast.error('Category description is required.');
      return;
    }
    if (!isEditMode && !imageFile) {
      toast.error('Please upload a category image.');
      return;
    }
    const formData = new FormData();
    formData.append('category_name', categoryName);
    formData.append('category_description', categoryDescription);
    if (imageFile) {
      formData.append('category_image', imageFile);
    }

    if (isEditMode) {
      dispatch(updateCategory({ id, formData }));
    } else {
      dispatch(createCategory(formData));
    }
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <section className="x_employee-section">
        <h4 className="x_employee-heading">{isEditMode ? 'Edit Category' : 'Add Category'}</h4>
        <div className="x_popup">
          <div
            className={`x_dropzone x_dropzone-multiple  dz-clickable ${imagePreview ? 'x_has-image' : ''}`}
            onClick={() => !imagePreview && document.getElementById('categoryImageInput').click()}
            style={{ cursor: 'pointer' }}
          >
            {!imagePreview && (
              <div className="dz-message x_dz-message">
                <img className="me-2" src={uplod} width="25" alt="upload" />
                Drop your files here
              </div>
            )}
            <input
              id="categoryImageInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview x_image-preview">
                <img src={imagePreview} alt="Category" className="x_uploaded-image" />
                <button
                  type="button"
                  className="x_remove-image-btn"
                  onClick={removeImage}
                  title="Remove image"
                >
                  <IoClose />
                  {/* &times; */}
                </button>
              </div>
            )}
          </div>
          <form className="row g-3 mt-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <label htmlFor="categoryName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="categoryName"
                name="categoryName"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                maxLength={50}
              />
            </div>
            <div className="col-12">
              <label htmlFor="categoryDescription" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="categoryDescription"
                name="categoryDescription"
                rows="3"
                placeholder="Enter category description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                required
                maxLength={200}
              ></textarea>
            </div>
            {error && <div className="col-12 text-danger">{error}</div>}
            <div className="col-12 d-flex justify-content-center x_btn_main">
              <button type="button" className="btn btn-secondary mx-2" onClick={() => navigate('/category-list')}>Cancel</button>
              <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

// Wrapper for route usage
export function AddCategoryWrapper() {
  const { id } = useParams();
  return <AddCategory categoryId={id} />;
}
