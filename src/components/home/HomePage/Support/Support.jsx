import { useState } from 'react';
import './Support.scss'
import { Navbar, Container } from "react-bootstrap";
import FooterFAQ from './FooterFAQ/FooterFAQ';
import HelpCenter from './HelpCenter/HelpCenter';
import TermUse from './TermUse/TermUser';
import Privacy from './Privacy/Privacy';
import CookiePref from './CookiePref/CookiePref';
import BusinessInfor from './BusinessInfor/BusiniessInfor';
import Contact from './Contact/Contact';
const Support = () => {
    const [activeItem, setActiveItem] = useState('Lịch');
    const [openItems, setOpenItems] = useState({});
    const menu = [
        "Câu Hỏi Thường Gặp",
        "Trung Tâm Trợ Giúp",
        "Điều Khoản Sử Dụng",
        "Quyền Riêng Tư",
        "Tùy Chọn Cookie",
        "Thông Tin Doanh Nghiệp",
        "Liên Hệ Với Chúng Tôi",
    ];

    const contentData = {
        "Câu Hỏi Thường Gặp": <FooterFAQ />,
        "Trung Tâm Trợ Giúp": <HelpCenter />,
        "Điều Khoản Sử Dụng": <TermUse />,
        "Quyền Riêng Tư": <Privacy />,
        "Tùy Chọn Cookie": <CookiePref />,
        "Thông Tin Doanh Nghiệp": <BusinessInfor />,
        "Liên Hệ Với Chúng Tôi": <Contact />,
    };

    const toggleItem = (label) => {
        setOpenItems(prev => ({ ...prev, [label]: !prev[label] }));
        setActiveItem(label);
    };

    const renderMenu = (item, index) => {
        if (typeof item === 'string') {
            return (
                <div
                    key={index}
                    className={`sidebar-item ${activeItem === item ? 'active' : ''}`}
                    onClick={() => setActiveItem(item)}
                >
                    <span className="icon">▶</span> {item}
                </div>
            );
        } else {
            const isOpen = openItems[item.label];
            return (
                <div key={index}>
                    <div
                        className={`sidebar-item ${activeItem === item.label ? 'active' : ''}`}
                        onClick={() => toggleItem(item.label)}
                    >
                        <span className="icon">{isOpen ? '▼' : '▶'}</span> {item.label}
                    </div>
                    {isOpen && (
                        <div className="sidebar-sub">
                            {item.subItems.map((sub, i) => (
                                <div
                                    key={i}
                                    className="sidebar-sub-item"
                                    onClick={() => setActiveItem(sub)}
                                >
                                    {sub}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    };

    return (

        <div className="support-container">
            <Container>
                <Navbar.Brand href="/">DTube</Navbar.Brand>
                <div className="sidebar-wrapper">
                    <div className="sidebar">
                        {menu.map((item, index) => renderMenu(item, index))}
                    </div>
                    <div className="rules">
                        {contentData[activeItem] ? (
                            <>
                                <h3>{activeItem}</h3>
                                {typeof contentData[activeItem] === 'string' ? (
                                    <p>{contentData[activeItem]}</p>
                                ) : (
                                    contentData[activeItem]
                                )}
                            </>
                        ) : (
                            <>
                                <h3>📘 TRANG HỖ TRỢ DTUBE</h3>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Support