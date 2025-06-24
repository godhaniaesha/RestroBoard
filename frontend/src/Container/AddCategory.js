import React from 'react';
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";

export default function AddCategory() {
  return (
    <>
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Add Category</h4>
        <div className="x_popup">
          <form className="x_dropzone x_dropzone-multiple dz-clickable" id="dropzone-multiple" data-dropzone="data-dropzone" action="#!">
            <div className="dz-message x_dz-message" data-dz-message="data-dz-message">
              <img className="me-2" src={uplod} width="25" alt="upload" />
              Drop your files here
            </div>
            <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview"></div>
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
