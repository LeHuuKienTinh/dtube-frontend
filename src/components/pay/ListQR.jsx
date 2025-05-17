import React, { useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axiosInstance from '../../service/axiosInstance';
import { useAuth } from '../../contexts/AuthProvider';

const ListQR = () => {
  const { pakages, calculateDiscount } = useOutletContext();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log("nguoidung", user)
  })
  const handleBuy = async (pakage) => {
    try {
      const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6 chữ số ngẫu nhiên
      const amount = Number(pakage.gia_chinh);
      const note = `DTUBE${randomDigits}`;

      // Gọi API tạo đơn hàng
      const res = await axiosInstance.post('/api/order/orders', {
        userId: user.id,
        packageId: pakage.id,
        amount,
        note
      });

      // Điều hướng sang trang MainQR và truyền dữ liệu
      navigate(`/pay/${pakage.id}`, {
        state: {
          pakageName: pakage.ten_pakage,
          amount,
          note,
          orderId: res.data.orderId
        }
      });
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  if (pakages.length === 0) {
    return <div className="no-packages">Không có gói nào. Vui lòng thử lại sau.</div>;
  }

  return (
    <div className="pakage-list">
      {pakages.map((item) => (
        <div className="pakage-card" key={item.id}>
          <h2 className="pakage-name">{item.ten_pakage}</h2>
          <div className="pakage-prices">
            <p className="gia-cu">Giá gốc: {Number(item.gia_truoc_khi_giam).toLocaleString()}đ</p>
            <p className="gia-moi">Chỉ còn: {Number(item.gia_chinh).toLocaleString()}đ</p>
            <p className="giam-phan-tram">
              Giảm: {calculateDiscount(item.gia_truoc_khi_giam, item.gia_chinh)}%
            </p>
          </div>
          <p className="thoi-gian">Thời gian: {item.kieu_thoi_gian} tháng</p>

          <div className="pakage-actions">
            <button className="mua-button" onClick={() => handleBuy(item)}>
              Mua ngay
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListQR;
