import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";  // Thay thế useHistory bằng useNavigate
import './Time.scss';

const Time = () => {
  const { user, logout } = useAuth();  // Lấy logout từ context
  const [timeLeft, setTimeLeft] = useState("Đang tải...");
  const [currentDate, setCurrentDate] = useState("");
  const navigate = useNavigate();  // Khởi tạo useNavigate

  useEffect(() => {
    // Hiển thị ngày hiện tại
    setCurrentDate(new Date().toLocaleDateString("vi-VN"));

    const updateCountdown = () => {
      if (!user?.accountExpiryTime) {
        setTimeLeft("Không có thông tin");
        return;
      }

      const expiry = new Date(user.accountExpiryTime);
      const now = new Date();
      let diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Đã hết hạn");

        // Chỉ logout nếu type === 2
        if (user?.type === 2) {
          logout();  // Gọi logout khi hết hạn
          navigate("/login");  // Chuyển hướng đến trang login
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Cập nhật mỗi giây
    return () => clearInterval(interval);
  }, [user?.accountExpiryTime, user?.type, logout, navigate]);  // Cập nhật khi user, thời gian hết hạn hoặc type thay đổi

  return (
    <div className="time-wrapper">
      <h2>Thời gian tài khoản</h2>
      <div className="time-main">
        <table className="table-time">
          <tbody>
            <tr>
              <th>Ngày bắt đầu: </th>
              <td>xxxxx</td>
            </tr>
            <tr>
              <th>Ngày hiện tại: </th>
              <td>{currentDate}</td>
            </tr>
            <tr>
              <th>Ngày hết hạn:</th>
              <td>{user?.accountExpiryTime
                ? new Date(user.accountExpiryTime).toLocaleDateString("vi-VN")
                : "Không có thông tin"}</td>
            </tr>
            <tr>
              <th>Thời gian còn lại:</th>
              <td>{timeLeft}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Time;
