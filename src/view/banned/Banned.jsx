import React from 'react'
import FooterHomePage from '../../components/home/HomePage/FooterHomePage/FooterHomePage'
import './Banned.scss'
import { useAuth } from '../../contexts/AuthProvider'
import { useNavigate } from 'react-router-dom';
import { FaBan } from "react-icons/fa";

const Banned = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  }

  return (
    <div>
      <div className='Main-Ban'>
        <div className="Ban-container">
          <div className="Ban-content">
            <h1 className="ban-title">Tài khoản của bạn đã bị hạn chế <FaBan /> </h1>
            <div className="ban-card">
              <div className="ban-message">
                <h3>Xin lỗi, {user.name}</h3>
                <p>Tài khoản của bạn hiện không thể truy cập do:</p>
                <ul className="reason-list">
                  <li><FaBan /> Vi phạm điều khoản dịch vụ</li>
                  <li><FaBan />Hành vi không phù hợp với cộng đồng</li>
                  <li><FaBan />Lạm dụng hệ thống</li>
                </ul>
                <div className="action-buttons">
                  <button className="contact-btn" onClick={() => navigate('/support')}>
                    <i className="fas fa-headset"></i> Liên hệ hỗ trợ
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterHomePage />
    </div>
  )
}

export default Banned