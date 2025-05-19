import React, { useState } from 'react';
import axios from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './ReserPassword.scss'
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('reset-token');

  const handleReset = async (e) => {
    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp.");
      return;
    }
    e.preventDefault();
    try {
      await axios.post('/api/auth/resetpassword', { token, newPassword: password });
      toast.success('Đặt lại mật khẩu thành công!');
      localStorage.removeItem('reset-token');
      localStorage.removeItem('reset-mail');
      navigate('/login');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi đặt lại mật khẩu');
    }
  };

  return (
    <div className='resetpass-container'>
      <h2 className='title-reset'>Đặt lại mật khẩu</h2>
      <form onSubmit={handleReset} className="reset-form">
        <label className="label-mail mb-2">Nhập mật khẩu mới</label>
        <input
          className="reset-input"
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="label-mail mb-2">Xác nhận mật khẩu mới</label>
        <input
          className="reset-input"
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className='reset-button' type="submit">Đổi mật khẩu</button>
      </form>
    </div>
  );
};

export default ResetPassword;
