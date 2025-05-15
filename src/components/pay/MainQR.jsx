import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../service/axiosInstance';
import { useAuth } from '../../contexts/AuthProvider';
import './MainQR.scss';

const MainQR = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [pakage, setPakage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy thông tin gói
    axiosInstance.get(`/api/pakage/${id}`)
      .then((res) => {
        setPakage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết gói:", err);
        setError("Không lấy được thông tin gói.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (pakage) {
      const initiateVnpayPayment = async () => {
        try {
          const response = await axiosInstance.post('/api/payment/create-payment-url', {
            amount: Number(pakage.gia_chinh),
            bankCode: 'NCB', // hoặc để trống: '', tùy chọn
            orderDescription: `${user?.mail || 'guest'} mua gói ${pakage.ten_goi}`,
            orderType: 'other',
            language: 'vn',
          });

          if (response.data?.success) {
            window.location.href = response.data.data.payment_url;
          } else {
            alert("Tạo thanh toán thất bại.");
          }
        } catch (err) {
          console.error("Lỗi tạo URL thanh toán:", err.response || err.message || err);
          alert("Lỗi kết nối tới hệ thống thanh toán.");
        }
      };

      initiateVnpayPayment();
    }
  }, [pakage, user]);

  if (loading) return <div className="loading-text">Đang tải chi tiết gói...</div>;
  if (error) return <div className="loading-text">{error}</div>;
  if (!pakage) return <div className="loading-text">Không tìm thấy gói.</div>;

  return (
    <div className="pakage-detail">
      <h2>Đang chuyển hướng tới cổng thanh toán...</h2>
    </div>
  );
};

export default MainQR;
