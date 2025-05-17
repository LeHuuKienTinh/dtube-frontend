import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MainQR = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pakageName, amount, note, orderId } = location.state || {};

  const bankCode = "MB";
  const accountNumber = "1234567890555";
  const accountName = "Le Huu Kien Tinh";

  if (!amount || !note) {
    return <div style={{ padding: 20 }}>Không có thông tin đơn hàng. <button onClick={() => navigate(-1)}>Quay lại</button></div>;
  }

  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&accountName=${encodeURIComponent(accountName)}&addInfo=${encodeURIComponent(note)}`;

  return (
    <div style={{ padding: '30px', maxWidth: 600, margin: '0 auto' }}>
      <h2>Thanh toán gói: <span style={{ color: '#007BFF' }}>{pakageName}</span></h2>
      <table style={{ marginTop: 20, width: '100%' }}>
        <tbody>
          <tr>
            <td><strong>Số tiền:</strong></td>
            <td>{amount.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td><strong>Nội dung CK:</strong></td>
            <td>{note}</td>
          </tr>
          <tr>
            <td><strong>Ngân hàng:</strong></td>
            <td>{bankCode}</td>
          </tr>
          <tr>
            <td><strong>Số tài khoản:</strong></td>
            <td>{accountNumber}</td>
          </tr>
          <tr>
            <td><strong>Chủ tài khoản:</strong></td>
            <td>{accountName}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <img src={qrUrl} alt="QR thanh toán" style={{ maxWidth: 300 }} />
        <p style={{ marginTop: 20, color: '#666' }}>
          Vui lòng chuyển khoản đúng <strong>số tiền</strong> và <strong>nội dung</strong> để hệ thống tự động xác nhận đơn hàng #{orderId}.
        </p>
      </div>
    </div>
  );
};

export default MainQR;
