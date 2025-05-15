import { useState } from 'react';
import './HelpCenter.scss';

const HelpCenter = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);

    const topics = [
        {
            title: 'Cách đăng ký DTube',
            content: 'Bạn có thể đăng ký DTube bằng cách nhấn vào nút "Đăng ký" ở góc màn hình đăng nhập và điền các thông tin cá nhân'
        },
        {
            title: 'Gói dịch vụ và mức giá',
            content: 'DTube hiện có gói dịch vụ: Cơ bản. Bao gồm các tính năng cơ bản, sẽ được phát triển trong thời gian tới'
        },
        {
            title: 'Không thể đăng nhập vào DTube',
            content: 'Hãy đảm bảo rằng bạn đã nhập đúng email và mật khẩu. Nếu vẫn không được, hãy thử đặt lại mật khẩu.'
        },
        {
            title: 'Các tính năng kiểm soát',
            content: 'Bạn có thể kiểm soát nội dung và quyền riêng tư trong phần Cài đặt tài khoản.'
        }
    ];

    const toggleTopic = (index) => {
        setSelectedTopic(selectedTopic === index ? null : index);
    };

    return (
        <>
            <h2>Chúng tôi có thể giúp như thế nào?</h2>
            <div className="list-support">
                <h4>Chủ đề phổ biến</h4>
                <ul>
                    {topics.map((topic, index) => (
                        <li key={index}>
                            <a
                                href="#"
                                className="chil-support"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleTopic(index);
                                }}
                            >
                                {topic.title}
                            </a>
                            {selectedTopic === index && (
                                <div className="support-content">
                                    {topic.content}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default HelpCenter;
