import React from 'react';
import './FooterFAQ.scss';
import imgIntro from '../../../../../../public/imgfaq1.png'
import imgContent from '../../../../../../public/imgfaq2.png'
import imgPay from '../../../../../../public/imgfaq3.png'
const FooterFAQ = () => {
    return (
        <div className="netflix-faq">
            <section className="faq-section">
                <h1>DTube là gì?</h1>
                <img src={imgIntro} alt="Netflix Interface" className="faq-image" />
                <div className="faq-content">
                    <p>
                        DTube là một <span className="highlight">dịch vụ phát trực tuyến</span> dựa trên gói đăng ký,
                        cho phép các thành viên của chúng tôi xem các bộ phim và series trên một thiết bị có kết nối Internet.
                    </p>
                    <p>
                        <span className="highlight">Tùy thuộc vào gói dịch vụ của mình</span>, bạn cũng có thể
                        <span className="highlight"> tải các bộ phim và series xuống </span>
                        điện thoại hoặc máy tính bảng Android, iPhone, iPad, hay thiết bị Google Chromebook để xem mà không cần kết nối Internet.
                    </p>
                    <p>
                        Nếu bạn đã là thành viên và muốn tìm hiểu về cách sử dụng DTube, hãy truy cập
                        <span className="highlight link"> Bắt đầu với DTube.</span>
                    </p>
                </div>
            </section>
            <hr />
            <section className="faq-section">
                <h2>Phim và series</h2>
                <img src={imgPay} alt="Netflix Shows" className="faq-image" />
                <div className="faq-content">
                    <p>
                        Nội dung của DTube khác nhau tùy từng khu vực và có thể thay đổi theo thời gian.
                        Bạn có thể xem nhiều <span className="highlight">
                            tác phẩm giành giải thưởng của DTube, series, phim, phim tài liệu và nhiều nội dung khác.
                        </span>
                    </p>
                    <p>
                        Bạn càng xem nhiều thì DTube càng có thể <span className="highlight">đề xuất</span> các series và phim phù hợp với bạn.
                    </p>
                </div>
            </section>
            <hr />
            <section className="faq-section">
                <h2>Các gói dịch vụ và mức phí</h2>
                <img src={imgContent} alt="Netflix Shows" className="faq-image" />
                <div className="faq-content">
                    <p>
                        Mỗi <span className='highlight'>gói dịch vụ của DTube</span> quy định số lượng thiết bị mà bạn có thể dùng để xem Netflix cùng một lúc và liệu bạn có thể xem ở Độ nét cao (HD), Độ nét cao hoàn chỉnh (FHD) hay Độ nét siêu cao (UHD) hay không.
                    </p>
                    <p>
                        Bạn có thể <span className='highlight'>thay đổi gói dịch vụ</span> hoặc <span className='highlight'>hủy</span> trực tuyến bất cứ lúc nào.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default FooterFAQ