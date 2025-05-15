import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../service/axiosInstance';

const Checktoken = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Đang kiểm tra token...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axiosInstance.post('/api/auth/checktoken', { token });
        const user = res.data;

        if (user && user.accessToken) {
          // Lưu thông tin user và token
          localStorage.setItem('token', user.accessToken);
          localStorage.setItem('user', JSON.stringify(user));

          // 🆕 Gửi thông tin thiết bị
          try {
            const deviceName = navigator.userAgent || 'Unknown Device';
            await axiosInstance.post('/api/device', {
              user_id: user.id,
              device_name: deviceName
            });
            console.log("✅ Thiết bị đã được ghi nhận từ Checktoken");
          } catch (err) {
            console.error("❌ Lỗi khi ghi nhận thiết bị:", err);
          }

          // Điều hướng theo type người dùng
          switch (user.type) {
            case '1':
              navigate('/admin');
              break;
            case '2':
              navigate('/');
              break;
            case '3':
              navigate('/pay');
              break;
            case '4':
              navigate('/ban');
              break;
            default:
              navigate('/intro');
          }

          setMessage('Đăng nhập thành công! Đang chuyển hướng...');
        } else {
          setMessage('Token không hợp lệ hoặc đã hết hạn');
        }
      } catch (error) {
        setMessage(error.response?.data?.message || 'Đã xảy ra lỗi khi kiểm tra token');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setMessage('Không tìm thấy token trong liên kết!');
      setLoading(false);
    }
  }, [token, navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {loading ? (
        <h2>Đang kiểm tra token...</h2>
      ) : (
        <h2>{message}</h2>
      )}
    </div>
  );
};

export default Checktoken;
