import React, { useEffect, useState } from 'react';
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";

export default function AddCategory() {
  const [supplierImg, setSupplierImg] = useState(null);
  const [supplierImgPreviewUrl, setSupplierImgPreviewUrl] = useState(null);


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
  return (
    <>
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Add Category</h4>
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
            {/* <div className="col-md-6">
              <label htmlFor="categoryImage" className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                id="categoryImage"
                name="categoryImage"
                accept="image/*"
              />
            </div> */}
            <div className="col-12">
              <label htmlFor="categoryName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="categoryName"
                name="categoryName"
                placeholder="Enter category name"
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
