import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import other components 
import SignOutConfirmation from  '../account/SignOutConfirmation'; // Adjusted path

export default function SignInPage() {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [otpTimer, setOtpTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // <-- Get previous route info

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Countdown for OTP
  useEffect(() => {
    let interval: number;
    if (step === 2 && !canResend) {
      interval = window.setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, canResend]);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobileNumber)) {
    alert('Please enter a valid 10-digit mobile number');
    return; // Stop submission if invalid
  }
    setStep(2);
    setOtpTimer(20);
    setCanResend(false);
    setOtp('');
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    let currentOtp = otp.padEnd(4, '');
    if (value.length === 1) {
      const digit = value.slice(-1);
      currentOtp = currentOtp.substring(0, index) + digit + currentOtp.substring(index + 1);
      setOtp(currentOtp);
      if (index < inputRefs.length - 1) inputRefs[index + 1].current?.focus();
    } else if (value === '') {
      currentOtp = currentOtp.substring(0, index) + currentOtp.substring(index + 1);
      setOtp(currentOtp);
      if (index > 0) inputRefs[index - 1].current?.focus();
    }
  };

 const handleOtpSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (otp === '1111') {
    alert('OTP verified successfully!');
    setStep(3);
  } else {
    alert('Wrong OTP!');
  }
};


  const handleResendOtp = () => {
    setOtp('');
    setOtpTimer(20);
    setCanResend(false);
    alert('OTP sent successfully!');
    inputRefs[0].current?.focus();
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save user info
    localStorage.setItem('userName', name);
    localStorage.setItem('userMobile', mobileNumber);
    window.dispatchEvent(
      new StorageEvent('storage', { key: 'userName', oldValue: null, newValue: name })
    );

    // Redirect to previous page or home
    const fromPath = (location.state as any)?.from || '/';
    const product = (location.state as any)?.product;
    const quantity = (location.state as any)?.quantity;

    navigate(fromPath, { state: { product, quantity } });
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      

      {/* Centered Sign In Box */}
      <div
        className="d-flex justify-content-center align-items-center flex-grow-1 bg-light"
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        <div className="card p-4 shadow-lg" style={{ width: '400px', maxWidth: '90%' }}>
          {step === 1 && (
            <>
              <div className="text-end mb-3">
                <button type="button" className="btn-close" aria-label="Close"></button>
              </div>
              <h2 className="text-center mb-4">Almost there!</h2>
              <p className="text-center text-muted mb-4">Simply sign in to place your order</p>
              <form onSubmit={handleMobileSubmit}>
                <div className="mb-3">
                  <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                  <div className="input-group">
                    <span className="input-group-text">+91</span>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobileNumber"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter your mobile number"
                      required
                      maxLength={10}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">Continue</button>
              </form>
              <p className="text-center text-muted mt-3" style={{ fontSize: '0.8rem' }}>
                By signing in, you agree to our{' '}
                <a href="#" className="text-decoration-none">Terms and Conditions</a> and{' '}
                <a href="#" className="text-decoration-none">Privacy Policy</a>.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-start mb-3 d-flex justify-content-between">
                <button type="button" className="btn btn-link text-decoration-none" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="btn-close" aria-label="Close"></button>
              </div>
              <h2 className="text-center mb-4">Verify OTP</h2>
              <p className="text-center text-muted mb-4">
                Enter the OTP sent to +91-{mobileNumber}{' '}
                <a href="#" className="text-decoration-none" onClick={() => setStep(1)}>Update number</a>
              </p>
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-3 d-flex justify-content-center">
                  {inputRefs.map((ref, index) => (
                    <input
                      key={index}
                      type="text"
                      className="form-control text-center me-2"
                      style={{ width: '50px' }}
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpChange(e, index)}
                      maxLength={1}
                      ref={ref}
                    />
                  ))}
                </div>
                <div className="text-center mb-4">
                  {!canResend ? (
                    <span style={{ fontSize: '0.8rem' }}>Resend OTP in {otpTimer}s</span>
                  ) : (
                    <button type="button" className="btn btn-link p-0" style={{ fontSize: '0.8rem' }} onClick={handleResendOtp}>
                      Resend OTP
                    </button>
                  )}
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">Continue</button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-start mb-3 d-flex justify-content-between">
                <button type="button" className="btn btn-link text-decoration-none" onClick={() => setStep(2)}>Back</button>
                <button type="button" className="btn-close" aria-label="Close"></button>
              </div>
              <h2 className="text-center mb-4">Enter Your Name</h2>
              <p className="text-center text-muted mb-4">Please provide your name to proceed.</p>
              <form onSubmit={handleNameSubmit}>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">Sign In</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
