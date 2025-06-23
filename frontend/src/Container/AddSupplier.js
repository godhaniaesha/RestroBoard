import React from 'react';
import "../Style/x_app.css";
import uplod from "../Image/cloud-upload.svg";

export default function AddSupplier() {
  return (
    <>
      <section className="x_employee-section">
        <h4 className="x_employee-heading">Add Supplier Form</h4>
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
              <img className="me-2" src={uplod} width="25" alt="upload" />
              Drop your files here
            </div>

            <div className="dz-preview dz-preview-multiple m-0 d-flex flex-column x_dz-preview"></div>
          </form>
          <form className="row g-3 mt-3">
            <div className="col-md-6">
              <label htmlFor="supplierId" className="form-label">
                ID
              </label>
              <input
                type="text"
                className="form-control"
                id="supplierId"
                name="supplierId"
                placeholder="Enter supplier ID"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="supplierName" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="supplierName"
                name="supplierName"
                placeholder="Enter supplier name"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="Enter phone number"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="whatsapp" className="form-label">
                WhatsApp Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="whatsapp"
                name="whatsapp"
                placeholder="Enter WhatsApp number"
              />
            </div>

            <div className="col-12">
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
            
            <div className="col-12">
              <label htmlFor="ingredients_supplied" className="form-label">
                Ingredients Supplied
              </label>
              <textarea
                className="form-control"
                id="ingredients_supplied"
                name="ingredients_supplied"
                rows="3"
                placeholder="e.g., Flour, Tomatoes, Olive Oil"
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
