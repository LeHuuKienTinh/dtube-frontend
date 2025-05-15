import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthProvider'; // Import useAuth từ AuthContext
import axiosInstance from '../../../../service/axiosInstance'; // Đảm bảo axiosInstance của bạn có đúng cấu hình
import './Devices.scss'; // Import CSS cho component
const Devices = () => {
  const { user } = useAuth(); // Lấy user từ AuthContext
  const [devicesData, setDevicesData] = useState(null); // Dữ liệu thiết bị
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const fetchDevices = async () => {
      if (!user?.id) {
        return; // Nếu không có user_id, không làm gì cả
      }
      try {
        const response = await axiosInstance.get(`/api/device/${user.id}`);
        setDevicesData(response.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchDevices();
  }, [user]); // Chạy lại khi user thay đổi

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!devicesData || devicesData.count === 0) {
    return <div>No devices found.</div>;
  }

  return (
    <div className="device-wrapper">
      <h2>Danh sách thiết bị</h2>
      <div className="device-main">
        <table className="device-table">
          <thead  >
            <tr>
              <th>Trình duyệt/Thiết bị đăng nhập</th>
              <th>Thời gian đăng nhập</th>
            </tr>
          </thead>
          <tbody>
            {devicesData.devices.map((device) => (
              <tr key={device.id}>
                <td>{device.device_name}</td>
                <td>{new Date(device.login_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Bạn đang sử dụng {devicesData.count} /6 thiết bị.</p>
      </div>
    </div>
  );
};

export default Devices;
