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
import { useNavigate } from 'react-router-dom';

export default function AddCategory({ categoryId}) {
  const navigate = useNavigate();
  const id = categoryId;
  const dispatch = useDispatch();

  const isEditMode = Boolean(id);
  const { loading, error, createSuccess, updateSuccess, selectedCategory } = useSelector((state) => state.category);

  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      navigate('category-list');
    }
    if (createSuccess) {
      dispatch(resetCreateSuccess());
      navigate('category-list');
    }
  }, [createSuccess, updateSuccess, navigate, dispatch]);


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
    const fileInput = document.getElementById('categoryImageInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
              ></textarea>
            </div>
            {error && <div className="col-12 text-danger">{error}</div>}
            <div className="col-12 d-flex justify-content-center x_btn_main">
              <button type="button" className="btn btn-secondary mx-2" onClick={() => navigate('category-list')}>Cancel</button>
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
