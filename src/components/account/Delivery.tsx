import React, { useState, useEffect } from 'react';

export default function Delivery() {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Form fields
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [stateField, setStateField] = useState('');
  const [pincode, setPincode] = useState('');

  // Load saved addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('addresses');
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  const resetForm = () => {
    setStreet('');
    setDistrict('');
    setStateField('');
    setPincode('');
    setEditIndex(null);
    setShowForm(false);
  };

  const handleSaveAddress = () => {
    if (!street || !district || !stateField || !pincode) {
      return alert('Please fill all address fields.');
    }

    const fullAddress = `${street}, ${district}, ${stateField} - ${pincode}`;
    const updatedAddresses = [...addresses];

    if (editIndex !== null) {
      updatedAddresses[editIndex] = fullAddress; // Edit existing
    } else {
      updatedAddresses.push(fullAddress); // Add new
    }

    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    resetForm();
  };

  const handleEditAddress = (index: number) => {
    const addr = addresses[index];
    const parts = addr.split(',');
    setStreet(parts[0]?.trim() || '');
    setDistrict(parts[1]?.trim() || '');
    const statePincode = (parts[2] || '').split('-');
    setStateField(statePincode[0]?.trim() || '');
    setPincode(statePincode[1]?.trim() || '');
    setEditIndex(index);
    setShowForm(true);
  };

  // Form fields array for mapping
  const fields = [
    { label: 'Street', value: street, setter: setStreet },
    { label: 'District/City', value: district, setter: setDistrict },
    { label: 'State', value: stateField, setter: setStateField },
    { label: 'Pincode', value: pincode, setter: setPincode },
  ];

  return (
  <div
      className="mt-4"
      style={{
        width: '80vw',        
        maxWidth: '1200px',   
        margin: '0 auto',     // center
        padding: '2rem',
      }}>
      <h4 className="mb-3 fw-bold">Delivery Addresses</h4>

      {addresses.length > 0 ? (
        addresses.map((addr, idx) => (
          <div
            key={idx}
            className="p-3 mb-2 bg-light border rounded d-flex justify-content-between align-items-center"
            style={{ width: '100%', maxWidth: '600px' }}
          >
            <div>
              <strong>
                Address {idx + 1} {idx === 0 && <span className="text-success">(Default)</span>}:
              </strong>
              <p className="mb-0">{addr}</p>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleEditAddress(idx)}
            >
              Edit
            </button>
          </div>
        ))
      ) : (
        <p>No saved addresses found.</p>
      )}

      {!showForm && (
        <button
          className="btn btn-primary rounded-pill mt-3"
          style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
          onClick={() => setShowForm(true)}
        >
          Add New Address
        </button>
      )}

      {showForm && (
        <div className="card p-4 mt-3" style={{ maxWidth: 600 }}>
          <h5 className="mb-3">{editIndex !== null ? 'Edit Address' : 'Add New Address'}</h5>
          {fields.map(({ label, value, setter }) => (
            <div key={label} className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={label}
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}
          <button className="btn btn-success w-100 mt-2" onClick={handleSaveAddress}>
            Save Address
          </button>
        </div>
      )}
    </div>
  );
}
