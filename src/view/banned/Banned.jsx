import React from 'react'
import FooterHomePage from '../../components/home/HomePage/FooterHomePage/FooterHomePage'
import './Banned.scss'
import { useAuth } from '../../contexts/AuthProvider'

const Banned = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => { 
    logout();
    window.location.href = '/login'; 
  }

  return (
    <div>
      <div className='Main-Ban'>
        <div className="Ban-container">
          <div className="user-info-panel">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
              </button>
            </div>
          </div>

          <div className="Ban-content">
            <h1 className="ban-title">Tài khoản của bạn đã bị hạn chế</h1>
            <div className="ban-card">
              <div className="ban-icon">
                <i className="fas fa-ban"></i>
              </div>
              <div className="ban-message">
                <h3>Xin lỗi, {user.name}</h3>
                <p>Tài khoản của bạn hiện không thể truy cập do:</p>
                <ul className="reason-list">
                  <li><i className="fas fa-times-circle"></i> Vi phạm điều khoản dịch vụ</li>
                  <li><i className="fas fa-times-circle"></i> Hành vi không phù hợp với cộng đồng</li>
                  <li><i className="fas fa-times-circle"></i> Lạm dụng hệ thống</li>
                </ul>
                <div className="action-buttons">
                  <button className="contact-btn">
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