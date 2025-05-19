import React, { useEffect, useState } from 'react';
import './VnpayAdmin.scss';
import axiosInstance from '../../../service/axiosInstance';

const VnpayAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/api/order/orders/all');
        setOrders(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.payment_status === filter;
  });

  const handleViewDetail = async (orderId) => {
    setShowModal(true);
    setModalLoading(true);
    try {
      const res = await axiosInstance.get(`/api/order/payment/get/${orderId}`);
      setPaymentDetail(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết thanh toán:', err);
      setPaymentDetail(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPaymentDetail(null);
  };

  return (
    <div className='transfer-wrapper'>
      <h2 className='title-transfer'>Quản lý Giao dịch</h2>

      <div className="filter-box">
        <label>Lọc theo trạng thái:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="paid">Đã thanh toán</option>
          <option value="pending">Chờ thanh toán</option>
          <option value="canceled">Thất bại</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên người dùng</th>
              <th>Gói</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  Không có đơn hàng nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.username}</td>
                  <td>{order.ten_package}</td>
                  <td>{order.amount.toLocaleString()} VND</td>
                  <td>
                    <span className={`status-tag ${order.payment_status}`}>
                      {order.payment_status === 'paid' && 'Đã thanh toán'}
                      {order.payment_status === 'pending' && 'Chờ thanh toán'}
                      {order.payment_status === 'canceled' && 'Thất bại'}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>
                    <button className="detail-btn" onClick={() => handleViewDetail(order.id)}>Xem</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay-transfer" onClick={closeModal}>
          <div className="modal-content-transfer" onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết giao dịch</h3>
            {modalLoading ? (
              <p>Đang tải...</p>
            ) : paymentDetail ? (
              <div className="payment-info">
                <table className='table'>
                  <tr>
                    <th>ID giao dịch:</th>
                    <th>{paymentDetail.sepay_id}</th>
                  </tr>
                  <tr>
                    <th>Ngân hàng</th>
                    <th>{paymentDetail.bank}</th>
                  </tr>
                  <tr>
                    <th>Mã giao dịch</th>
                    <th>{paymentDetail.reference_code}</th>
                  </tr>
                  <tr>
                    <th>Số tiền</th>
                    <th>{paymentDetail.amount.toLocaleString()} VND</th>
                  </tr>
                  <tr>
                    <th>Thời gian thanh toán</th>
                    <th>{paymentDetail.created_at}</th>
                  </tr>
                  <tr>
                    <th>Ghi chú</th>
                    <th> {paymentDetail.content}</th>
                  </tr>
                </table>
              </div>
            ) : (
              <p>Không thể lấy thông tin giao dịch.</p>
            )}

            <button onClick={closeModal} className="close-btn">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VnpayAdmin;
