import React, { useState } from 'react';
import axiosInstance from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Gettoken.scss';

const Gettoken = () => {
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axiosInstance.post('/api/auth/sendtoken', { mail });
      setMessage('✅ Đã gửi Token, kiểm tra Email của bạn!');
      setTimeout(() => navigate('/token'), 2500);
    } catch (err) {
      setError('❌ Gửi thất bại, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gettoken-wrapper">
      <h2 className="gettoken-title">Gửi mã đăng nhập</h2>
      <form onSubmit={handleSubmit} className="gettoken-form">
        <h2 className="label-mail">Địa chỉ email</h2>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
          className="gettoken-input"
          disabled={loading}
        />

        {error && <p className="gettoken-error">{error}</p>}
        {message && <p className="gettoken-message">{message}</p>}

        <button type="submit" className="gettoken-button" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Gửi mã'}
        </button>
      </form>
    </div>
  );
};

export default Gettoken;
