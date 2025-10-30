import React from "react";
import type { Product, CartItem ,DeliveryAddressFormProps} from "../../types"; // Adjusted path for types


export default function DeliveryAddressForm({
  savedAddress,
  editAddress,
  setEditAddress,
  handleSaveAddress,
  street,
  setStreet,
  pincode,
  setPincode,
  district,
  setDistrict,
  stateField,
  setStateField,
}: DeliveryAddressFormProps) {
  // Array to hold input field details for mapping
  const fields = [
    { label: "Street", value: street, setter: setStreet },
    { label: "District/City", value: district, setter: setDistrict },
    { label: "State", value: stateField, setter: setStateField },
    { label: "Pincode", value: pincode, setter: setPincode },
  ];

  return (
    <div className="card p-4 mb-3 w-100">
      <h4 className="fw-bold mb-3">Delivery Address</h4>

      {(!savedAddress || editAddress) ? (
        <div className="row g-2">
          {fields.map(({ label, value, setter }) => (
            <div key={label} className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder={label}
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}

          <div className="col-12 mt-2">
            <button className="btn btn-success" onClick={handleSaveAddress}>
              Save Address
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-light border rounded d-flex justify-content-between align-items-center">
          <div>
            <strong>Saved Address:</strong>
            <p className="mb-0 ms-2">{savedAddress}</p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setEditAddress(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
