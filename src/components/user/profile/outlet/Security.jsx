import React, { useState } from 'react';
import axiosInstance from '../../../../service/axiosInstance';
import { useAuth } from '../../../../contexts/AuthProvider'; // ← import Auth context
import './Security.scss'; // Import file SCSS
import { toast } from 'react-toastify';

const Security = () => {
  const { user } = useAuth(); // lấy user hiện tại
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setMessage('❌ Mật khẩu mới không khớp!');
    }

    try {
      const response = await axiosInstance.post('/api/auth/change-password', {
        oldPassword,
        newPassword
      });

      setMessage(`✅ ${response.data.message}`);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success("Đổi mật khẩu thành công!")
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại');
    }
  };

  return (
    <div className='change-password-wrapper'>
      <h2>Đổi mật khẩu</h2>
      <div className="change-password-main">
        <table className="change-password-table">
          <tbody>
            <tr>
              <th>Username: </th>
              <td>{JSON.parse(localStorage.getItem('user'))?.username}</td>
            </tr>
            <tr>
              <th>Mật khẩu cũ: </th>
              <td>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className='form-control input-password' /></td>
            </tr>
            <tr>
              <th>Mật khẩu mới:</th>
              <td>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className='form-control input-password' /></td>
            </tr>
            <tr>
              <th>Nhập lại mật khẩu mới:</th>
              <td>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='form-control input-password' /></td>
            </tr>
            <tr>
              <th></th>
              <td>
                <button onClick={handleChangePassword} className="submit-button">
                  Đổi mật khẩu
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Security;
