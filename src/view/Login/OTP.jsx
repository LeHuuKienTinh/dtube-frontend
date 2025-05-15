import React, { useState, useRef } from 'react';
import axios from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './OTP.scss'; // 👈 Import file SCSS

const OTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const mail = localStorage.getItem('reset-mail');

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }

    if (index === 5 && newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleVerify = async (code) => {
    try {
      const res = await axios.post('/api/auth/verifyotp', { mail, otp: code });
      localStorage.setItem('reset-token', res.data.resetToken);
      setStatus('success');
      setTimeout(() => {
        navigate('/reset-password');
      }, 1000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="otp-container">
      <h2 className="otp-title">Nhập mã OTP</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="otp-input-group">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`otp-input ${status === 'success' ? 'otp-success' : ''} ${
                status === 'error' ? 'otp-error' : ''
              }`}
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default OTP;
