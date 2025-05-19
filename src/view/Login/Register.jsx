import React, { useState, useEffect } from "react";
import "./Register.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthProvider';
import { toast } from 'react-toastify';
const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    mail: '',
    password: '',
    confirmPassword: ''
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

    const { username, name, mail, password, confirmPassword } = formData;

    // Check: không được để trống
    if (!mail || !username || !name || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      toast.error("Địa chỉ email không hợp lệ.");
      return;
    }

    // Validate username (không chứa dấu cách)
    if (/\s/.test(username)) {
      toast.error("Tên đăng nhập không được chứa dấu cách.");
      return;
    }
    if (username.length < 6) {
      toast.error("Tên đăng nhập phải có ít nhất 6 ký tự.");
      return;
    }
    // Validate họ và tên (chỉ chứa chữ cái và dấu cách, hỗ trợ tiếng Việt)
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!nameRegex.test(name)) {
      toast.error("Họ và tên chỉ được chứa chữ cái và dấu cách.");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("Họ và tên phải có ít nhất 2 ký tự.");
      return;
    }

    // Validate mật khẩu (ít nhất 6 ký tự, gồm chữ và số)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự, bao gồm cả chữ và số.");
      return;
    }

    // So sánh mật khẩu nhập lại
    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp.");
      return;
    }

    // Xóa confirmPassword trước khi gửi
    const { confirmPassword: _, ...dataToSubmit } = formData;

    const response = await register(dataToSubmit);

    if (response.success) {
      navigate('/login');
      toast.success("Đăng ký thành công!");
    } else {
      setError(response.message);
      toast.error(response.message);
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
            // required
            />
          </div>

          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input
              name="username"
              type="text"
              placeholder="Nhập tên người dùng..."
              value={formData.username}
              onChange={handleChange}
            // required
            />
          </div>

          <div className="input-group">
            <label>Họ Và Tên</label>
            <input
              name="name"
              type="text"
              placeholder="Nhập họ và tên..."
              value={formData.name}
              onChange={handleChange}
            // required
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
            // required
            />
          </div>
          <div className="input-group">
            <label>Nhập lại mật khẩu</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu..."
              value={formData.confirmPassword}
              onChange={handleChange}
            // required
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
