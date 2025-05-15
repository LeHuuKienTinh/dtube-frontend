import React, { useState, useEffect } from "react";
import "./Register.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthProvider';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    mail: '',
    password: ''
  });
  const [error, setError] = useState(null);

  // Chặn người đã đăng nhập truy cập trang này
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const response = await register(formData);

    if (response.success) {
      navigate('/login');
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="title">Đăng ký</h2>

          <div className="input-group">
            <label>Địa chỉ Email</label>
            <input
              name="mail"
              type="email"
              placeholder="Nhập email của bạn..."
              value={formData.mail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Tên người dùng</label>
            <input
              name="username"
              type="text"
              placeholder="Nhập tên người dùng..."
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Họ Và Tên:</label>
            <input
              name="name"
              type="text"
              placeholder="Nhập họ và tên..."
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Tôi đồng ý với các điều khoản và điều kiện của DTube</label>
          </div>
          <button className="submit-button" type="submit">Đăng ký</button>
          <p className="login-text">
            Đã có tài khoản? <NavLink to="/login">Đăng nhập ngay!</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
