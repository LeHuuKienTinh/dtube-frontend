import './FooterHomePage.scss'
import { useNavigate } from 'react-router-dom';
const FooterHomePage = () => {
    const navigate = useNavigate();
    const footerLinks = [
        ["Câu hỏi thường gặp", "Tùy chọn cookie"],
        ["Trung tâm trợ giúp", "Thông tin doanh nghiệp"],
        ["Điều khoản sử dụng"],
        ["Quyền riêng tư"],
    ];

    // const linkIndex = [];

    return (
        <div className='footer-help'>
            <footer className="footer">
                <div className='question-yourself'>
                    <a className='contact' onClick={() => navigate('/support')} >Bạn có câu hỏi? Liên hệ với chúng tôi!a</a>
                </div>
                <div className="footer-container">
                    {footerLinks.map((column, colIndex) => (
                        <div className="footer-column" key={colIndex}>
                            {column.map((link, linkIndex) => (
                                <a href="facebook.com" key={linkIndex}>{link}</a>
                            ))}
                        </div>
                    ))}
                </div>
            </footer></div>
    );
}

export default FooterHomePage;