import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
// import './PaymentReturn.scss'; 

const PaymentReturn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        const params = queryString.parse(location.search);
        const responseCode = params.vnp_ResponseCode;

        if (responseCode === '00') {
            setPaymentResult({
                success: true,
                message: 'Thanh toán thành công!',
                transactionId: params.vnp_TxnRef,
                amount: Number(params.vnp_Amount) / 100,
            });
        } else {
            setPaymentResult({
                success: false,
                message: 'Thanh toán thất bại hoặc bị huỷ.',
                transactionId: params.vnp_TxnRef,
            });
        }
    }, [location.search]);

    const handleBack = () => {
        navigate('/'); // về trang chủ hoặc /pay
    };

    if (!paymentResult) return <div className="loading-text">Đang xác minh thanh toán...</div>;

    return (
        <div className="payment-return">
            <h2>{paymentResult.success ? '✅ Thành Công' : '❌ Thất Bại'}</h2>
            <p>{paymentResult.message}</p>
            <p><strong>Mã giao dịch:</strong> {paymentResult.transactionId}</p>
            {paymentResult.success && (
                <p><strong>Số tiền:</strong> {paymentResult.amount.toLocaleString('vi-VN')}đ</p>
            )}

            <button onClick={handleBack} className="back-btn">
                {paymentResult.success ? 'Về Trang Chủ' : 'Thử Lại'}
            </button>
        </div>
    );
};

export default PaymentReturn;
