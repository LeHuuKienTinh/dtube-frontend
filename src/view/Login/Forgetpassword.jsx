import React, { useState } from 'react';
import axios from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Forgetpassword.scss';

const ForgetPassword = () => {
  const [mail, setMail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/forgotpassword', { mail }); // Updated API endpoint
      localStorage.setItem('reset-mail', mail);
      alert('Đã gửi mã OTP tới email của bạn');
      navigate('/verify-otp');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi gửi email');
    }
  };

  return (
    <div className="forget-password-container">
      <h2 className="forget-password-title">Quên mật khẩu</h2>
      <form className="forget-password-form" onSubmit={handleSubmit}>
        <label className='label-mail' htmlFor="">Địa chỉ email</label>
        <input
          className="forget-password-input"
          type="email"
          placeholder="Nhập email của bạn"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
        />
        <button className="forget-password-button" type="submit">Gửi OTP</button>
      </form>
    </div>
  );
};

export default ForgetPassword;
