import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MainQR = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pakageName, amount, note, orderId } = location.state || {};
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const bankCode = "MB";
  const accountNumber = "1234567890555";
  const accountName = "Le Huu Kien Tinh";

  if (!amount || !note) {
    return (
      <div style={{ padding: 20 }}>
        Không có thông tin đơn hàng. <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&accountName=${encodeURIComponent(accountName)}&addInfo=${encodeURIComponent(note)}`;

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/${note}/status`);
        if (!res.ok) throw new Error('Không tìm thấy đơn hàng');
        const data = await res.json();
        setStatus(data.status);
        console.log('API status:', data.status);
        if (data.status === 'paid') {
          clearInterval(intervalId);
          setShowModal(true);
        }
      } catch (err) {
        setError(err.message);
      }
    }, 5000);

    // Check ngay lần đầu
    (async () => {
      try {
        const res = await fetch(`/api/order/${note}/status`);
        if (!res.ok) throw new Error('Không tìm thấy đơn hàng');
        const data = await res.json();
        setStatus(data.status);
        console.log('Initial API status:', data.status);
        if (data.status === 'paid') {
          clearInterval(intervalId);
          setShowModal(true);
        }
      } catch (err) {
        setError(err.message);
      }
    })();

    return () => clearInterval(intervalId);
  }, [note]);

  return (
    <div style={{ padding: '30px', maxWidth: 600, margin: '0 auto' }}>
      <h2>Thanh toán gói: <span style={{ color: '#007BFF' }}>{pakageName}</span></h2>
      <table style={{ marginTop: 20, width: '100%' }}>
        <tbody>
          <tr><td><strong>Số tiền:</strong></td><td>{amount.toLocaleString()} VND</td></tr>
          <tr><td><strong>Nội dung CK:</strong></td><td>{note}</td></tr>
          <tr><td><strong>Ngân hàng:</strong></td><td>{bankCode}</td></tr>
          <tr><td><strong>Số tài khoản:</strong></td><td>{accountNumber}</td></tr>
          <tr><td><strong>Chủ tài khoản:</strong></td><td>{accountName}</td></tr>
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <img src={qrUrl} alt="QR thanh toán" style={{ maxWidth: 300 }} />
        <p style={{ marginTop: 20, color: '#666' }}>
          Vui lòng chuyển khoản đúng <strong>số tiền</strong> và <strong>nội dung</strong> để hệ thống tự động xác nhận đơn hàng #{orderId}.
        </p>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white', padding: 30, borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)', textAlign: 'center',
            maxWidth: 400,
          }}>
            <h2 className='text-dark'>Thanh toán thành công!</h2>
            <p className='text-dark'>Bạn đã thanh toán {pakageName} thành công.</p>
            <button
              style={{
                marginTop: 20, padding: '10px 20px',
                backgroundColor: '#007BFF', color: 'white',
                border: 'none', borderRadius: 5, cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              Xem phim ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainQR;
