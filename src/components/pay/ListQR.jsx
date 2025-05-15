import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const ListQR = () => {
  const { pakages, calculateDiscount } = useOutletContext();
  const navigate = useNavigate(); // ✅ Dùng để điều hướng

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

          <p className="thoi-gian">Thời gian: {item.kieu_thoi_gian}</p>

          <div className="pakage-actions">
            {/* ✅ Gộp chức năng vào nút này */}
            <button
              className="mua-button"
              onClick={() => navigate(`/pay/${item.id}`)}
            >
              Mua ngay
            </button>
          </div>
        </div>
      ))}

    </div>
  );
};

export default ListQR;
