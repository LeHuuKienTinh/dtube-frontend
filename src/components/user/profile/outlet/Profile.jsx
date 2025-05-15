import React from 'react';
import { useAuth } from '../../../../contexts/AuthProvider';
import './Profile.scss';

const Profile = () => {
  const { user } = useAuth();

  const getUserType = (type) => {
    if (type == 1) return '🛡️ Admin';
    if (type == 2) return '👤 User';
    if (type == 3) return '⏳ Hết Hạn';
    if (type == 4) return '🚫 Bị Cấm';
    return 'Không xác định';
  };

  const handleCopyToken = () => {
    const token = localStorage.getItem('token'); // Hoặc lấy từ context nếu bạn lưu ở đó
    if (token) {
      navigator.clipboard.writeText(token);
      alert('✅ Token đã được copy!');
    } else {
      alert('⚠️ Không tìm thấy token!');
    }
  };

  return (
    <div className='profile-wrapper'>
      <div className="profile-container">
        <h2>Thông tin tài khoản</h2>
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Username</th>
              <th></th>
              <td>{user?.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <th></th>
              <td>{user?.mail}</td>
            </tr>
            <tr>
              <th>Tên</th>
              <th></th>
              <td>{user?.name}</td>
            </tr>
            <tr>
              <th>Loại tài khoản</th>
              <th></th>
              <td>{getUserType(user?.type)}</td>
            </tr>
            <tr>
              <th>Ngày tạo</th>
              <th></th>
              <td>{new Date(user?.created).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Hạn tài khoản</th>
              <th></th>
              <td>{new Date(user?.accountExpiryTime).toLocaleString()}</td>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <td className="btn-group">
                <button className="copy-token-btn" onClick={handleCopyToken}>
                  📋 Lấy Mã Đăng Nhập
                </button>
                <button className="copy-token-btn" onClick={() => alert("🚪 Đăng xuất")}>
                  Đăng xuất
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default Profile;
