import React from 'react';

export default function LegalInformation() {
  return (
      <div
      className="mt-4"
      style={{
        width: '80vw',        // same as MyWishlist
        maxWidth: '1200px',   // optional max width
        margin: '0 auto',     // center it
        padding: '2rem',
      }}>
      <h4 className="mb-3 fw-bold">Legal Information</h4>
      <p>This site is governed by JioMart’s Terms of Service and Privacy Policy.</p>
      <p>All content, logos, and trademarks are property of their respective owners.</p>
    </div>
  );
}
