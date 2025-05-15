import React, { useState } from 'react';
import axios from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('reset-token');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/resetpassword', { token, newPassword: password });
      alert('Đặt lại mật khẩu thành công!');
      localStorage.removeItem('reset-token');
      localStorage.removeItem('reset-mail');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi đặt lại mật khẩu');
    }
  };

  return (
    <div>
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleReset}>
        <input type="password" placeholder="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Đổi mật khẩu</button>
      </form>
    </div>
  );
};

export default ResetPassword;
