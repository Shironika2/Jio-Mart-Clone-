import React, { useState, useEffect } from 'react';
import './DeliveryLocationSelector.css';

const predefinedLocations = [
  { city: 'Chennai', pincode: '600001' },
  { city: 'Coimbatore', pincode: '641001' },
  { city: 'Madurai', pincode: '625001' },
  { city: 'Tiruchirappalli', pincode: '620001' },
  { city: 'Salem', pincode: '636001' },
];

export default function DeliveryLocationSelector() {
  const [showModal, setShowModal] = useState(false);
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState(
    localStorage.getItem('deliveryAddress') ||
      `${predefinedLocations[0].city} ${predefinedLocations[0].pincode}`
  );

  // ================= Initialization =================
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    setIsLoggedIn(!!storedName);
    

    const hasShown = sessionStorage.getItem('forcedModalShown');
    if (!storedName && !hasShown) {
      setShowModal(true);
      sessionStorage.setItem('forcedModalShown', 'true');
    }

    const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    setSavedAddresses(addresses);

    // Ensure selected address persists
    const storedAddress = localStorage.getItem('deliveryAddress');
    if (storedAddress) setSelectedAddress(storedAddress);
  }, []);

  // ================= Apply / Save Address =================
  const handleApply = () => {
    if (!pincode.trim()) {
      setError('Please enter a pincode or city.');
      return;
    }

    const location = predefinedLocations.find(
      (loc) =>
        loc.pincode === pincode || loc.city.toLowerCase() === pincode.toLowerCase()
    );

    if (location) {
      const fullAddress = `${location.city} ${location.pincode}`;
      setSelectedAddress(fullAddress);
      localStorage.setItem('deliveryAddress', fullAddress);
      setShowModal(false);
      setPincode('');
      setError('');
    } else {
      setError('Sorry, we currently do not deliver to this pincode.');
    }
  };

  const handleSignInClick = () => {
    window.location.href = '/login';
  };

  const filteredLocations = predefinedLocations.filter(
    (loc) =>
      loc.city.toLowerCase().includes(pincode.toLowerCase()) ||
      loc.pincode.startsWith(pincode)
  );

  return (
    <>
      <span
        className="text-white fw-bold"
        role="button"
        onClick={() => setShowModal(true)}
      >
        Delivery to: {selectedAddress}
      </span>

      {showModal && (
        <div className="bottom-modal small-bottom-modal">
          <div className="modal-content-custom small-content-custom">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0 text-black fw-bold">Enter PIN Code</h5>
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>

            <p className="text-muted">
              Set your delivery location to see product availability, offers and discounts.
            </p>

            {!isLoggedIn ? (
              <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleSignInClick}
              >
                Sign In to select address
              </button>
            ) : savedAddresses.length > 0 ? (
              <div
                className="saved-addresses-container mb-3"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                }}
              >
                {savedAddresses.map((addr, idx) => (
  <div
    key={idx}
    className="saved-address-box p-2 border rounded"
    role="button"
    onClick={() => {
      setSelectedAddress(addr);
      localStorage.setItem("deliveryAddress", addr);
      setShowModal(false);
      setError('');
    }}
  >
    <p className="fw-bold mb-1">Address {idx + 1}</p>
    <p className="mb-0">{addr}</p>
  </div>
))}

              </div>
            ) : null}

            <div className="mb-3">
              <label htmlFor="pincode" className="form-label">
                Pincode
              </label>
              <input
                type="text"
                className="form-control"
                maxLength={6}
                placeholder="Enter your Pincode"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value);
                  setError('');
                }}
              />
              <button
                className="btn btn-outline-primary w-100 mt-2"
                onClick={handleApply}
              >
                Apply
              </button>
              {error && <div className="text-danger mt-2 small">{error}</div>}
            </div>

            {pincode && filteredLocations.length > 0 && (
              <div className="predefined-pincodes">
                <p className="mb-1 fw-bold">Suggestions</p>
                {filteredLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    className="btn btn-light w-100 mb-2 text-start"
                    onClick={() => {
                      const fullAddress = `${loc.city} ${loc.pincode}`;
                      setSelectedAddress(fullAddress);
                      localStorage.setItem('deliveryAddress', fullAddress);
                      setShowModal(false);
                      setPincode('');
                      setError('');
                    }}
                  >
                    {loc.city} - {loc.pincode}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
