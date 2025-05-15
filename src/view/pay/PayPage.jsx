import React, { useEffect, useState } from 'react';
import './PayPage.scss';
import FooterHomePage from '../../components/home/HomePage/FooterHomePage/FooterHomePage';
import { useAuth } from '../../contexts/AuthProvider';
import axiosInstance from '../../service/axiosInstance';
import { Outlet } from 'react-router-dom'; // Import Outlet
import { useNavigate } from 'react-router-dom';

const PayPage = () => {
  const navigate = useNavigate();
  const [pakages, setPakages] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm loading state
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  useEffect(() => {
    axiosInstance.get('/api/pakage')
      .then((res) => {
        setPakages(res.data);
        setLoading(false); // Dữ liệu đã tải xong
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu gói:", err);
        setLoading(false); // Kết thúc loading dù có lỗi hay không
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleBuyPackage = (idPackage, price) => {
    axiosInstance.post('/api/vnpay/payment', {
      email: user.email,
      idPackage: idPackage,
      amount: price,
    })
      .then((res) => {
        window.location.href = res.data.paymentUrl;
      })
      .catch((err) => {
        console.error("Lỗi khi tạo mã thanh toán:", err);
      });
  };

  const calculateDiscount = (oldPrice, newPrice) => {
    const discount = 100 - Math.round((newPrice / oldPrice) * 100);
    return discount;
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>; // Thêm thông báo tải dữ liệu
  }

  return (
    <div>
      <div className='main-Pay'>
        <header className="netflix-header-pay">
          <h1 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>DTube</h1>
          <div className='logout-wrapper'>
            <div className='user-info'>
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className='user-name'>{user.name}</span>
            </div>
            {/* <button className='btn-logout' onClick={handleLogout} >Đăng xuất</button> */}
          </div>
        </header>
        <div className='Pay-bord'>
          <h1>Chọn gói dịch vụ</h1>
          <Outlet context={{ pakages, handleBuyPackage, calculateDiscount }} />
          <p className='have-account'>Đã có tài khoản? <a onClick={handleLogout} className='login-now'>Đăng nhập ngay!</a></p>
        </div>

      </div>
      <FooterHomePage />
    </div>
  );
};

export default PayPage;
