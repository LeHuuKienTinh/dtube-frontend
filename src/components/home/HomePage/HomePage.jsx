import React, { useState, useEffect } from 'react';
import './HomePage.scss';
import Footer from '../../home/HomePage/FooterHomePage/FooterHomePage.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthProvider.jsx';
const Introduction = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Kiểm tra đăng nhập nghiêm ngặt
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    // Xác thực token hợp lệ (có thể thêm logic verify token nếu cần)
                    navigate('/', {
                        replace: true, // Ngăn quay lại bằng history
                        state: { from: '/intro' } // Lưu trạng thái để xử lý sau này
                    });
                } catch (error) {
                    console.error('Lỗi xác thực:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else if (isAuthenticated) {
                navigate('/', { replace: true });
            }
        };

        checkAuth();
    }, [user, isAuthenticated, navigate]);

    const handleGetStarted = () => {
        if (!email.trim()) return;
        navigate('/login', {
            state: { email },
            replace: true // Ngăn quay lại intro từ trang login
        });
    };

    // Nếu đang kiểm tra đăng nhập, hiển thị loading
    if (localStorage.getItem('token') && !user) {
        return <div className="loading-screen">Đang kiểm tra...</div>;
    }

    return (
        <div className="netflix-intro">
            <section className="hero-section">
                <header className="netflix-header">
                    <h1 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>DTube</h1>
                    <button className='btn-login' onClick={() => navigate('/login')} >Đăng nhập</button>
                </header>
                <div className="hero-content">
                    <h2 className='main-title'>Phim, series không giới hạn và nhiều nội dung khác</h2>
                    <p className="subtitle">Xem ở bất cứ đâu. Hủy bất cứ lúc nào.</p>
                    <p className="email-prompt">Sẵn sàng xem chưa? Nhập email của bạn để bắt đầu hoặc khởi động lại tư cách thành viên.</p>
                    <div className="email-form">
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="cta-button" onClick={handleGetStarted}>Bắt đầu</button>
                    </div>
                </div>
            </section>
            <hr style={{ margin: '0' }} />
            <section className="feature-section">
                {[
                    {
                        title: 'Thưởng thức trên TV của bạn',
                        desc: 'Xem trên Smart TV, Playstation, Xbox, Chromecast, Apple TV, đầu phát Blu-ray và nhiều thiết bị khác.',
                        imageClass: 'tv-image'
                    },
                    {
                        title: 'Tải chương trình để xem ngoại tuyến',
                        desc: 'Lưu lại mục yêu thích dễ dàng và luôn có nội dung để xem.',
                        imageClass: 'mobile-image',
                        reverse: true
                    },
                    {
                        title: 'Xem ở mọi nơi',
                        desc: 'Xem không giới hạn trên điện thoại, tablet, laptop và TV.',
                        imageClass: 'device-image'
                    },
                    {
                        title: 'Tạo hồ sơ cho trẻ em',
                        desc: 'Không gian riêng với nội dung phù hợp cho trẻ — miễn phí khi bạn đăng ký.',
                        imageClass: 'kids-image',
                        reverse: true
                    }
                ].map((item, idx) => (
                    <div key={idx} className={`feature ${item.reverse ? 'reverse' : ''}`}>
                        <div className="text">
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                        <div className={`image ${item.imageClass}`} />
                    </div>
                ))}
            </section>
            <Footer />
        </div>
    );
};

export default Introduction;