import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axiosInstance from '../../../service/axiosInstance'; // đường dẫn axiosInstance của bạn
import './Dashbord.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashbord = () => {
  const [userData, setUserData] = useState([]);

  // Lấy dữ liệu người dùng từ API
  useEffect(() => {
    axiosInstance.get('api/admin/users')  // Điều chỉnh URL theo đúng API của bạn
      .then(res => {
        setUserData(res.data.users);
      })
      .catch(err => console.error(err));
  }, []);

  // Tính toán số lượng người dùng theo loại
  const countTypes = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    userData.forEach(user => {
      counts[user.type]++;
    });
    return counts;
  };

  const userCounts = countTypes();

  const data = {
    labels: ['Admin', 'User', 'Hết hạn', 'Banned'],
    datasets: [
      {
        data: [userCounts[1], userCounts[2], userCounts[3], userCounts[4]],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-item admin-container">
        <div className="chart-container">
          <h3>Phân loại người dùng</h3>
          <Pie data={data} />
          <div className="chart-info">
            {Object.keys(userCounts).map((key) => (
              <div key={key}>
                <span style={{ color: data.datasets[0].backgroundColor[key - 1] }}>
                  {data.labels[key - 1]}:
                </span>
                {userCounts[key]} ({((userCounts[key] / userData.length) * 100).toFixed(2)}%)
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
