import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../service/axiosInstance';
import './HistoryAdmin.scss';

const HistoryAdmin = () => {
  const [histories, setHistories] = useState([]);
  const [userId, setUserId] = useState('');
  const [movieName, setMovieName] = useState('');
  const [sortType, setSortType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get(`/api/history/${userId}`);
      let data = res.data;

      // Lọc theo tên phim
      if (movieName) {
        data = data.filter(h =>
          h.movie_name.toLowerCase().includes(movieName.toLowerCase())
        );
      }

      // Lọc theo thời gian
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        data = data.filter(h => {
          const watchedAt = new Date(h.watched_at);
          return watchedAt >= start && watchedAt <= end;
        });
      }

      // Sắp xếp
      if (sortType === 'most') {
        const count = {};
        data.forEach(h => {
          count[h.movie_slug] = (count[h.movie_slug] || 0) + 1;
        });
        data.sort((a, b) => (count[b.movie_slug] || 0) - (count[a.movie_slug] || 0));
      } else if (sortType === 'least') {
        const count = {};
        data.forEach(h => {
          count[h.movie_slug] = (count[h.movie_slug] || 0) + 1;
        });
        data.sort((a, b) => (count[a.movie_slug] || 0) - (count[b.movie_slug] || 0));
      }

      setHistories(data);
    } catch (err) {
      console.error('Lỗi khi lấy lịch sử:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId, movieName, sortType, startDate, endDate]);

  return (
    <div className="history-admin">
      <h1>Lịch sử người dùng</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Nhập ID người dùng"
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tìm theo tên phim"
          value={movieName}
          onChange={e => setMovieName(e.target.value)}
        />
        <div className="date-range">
          <label>Từ:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <label>Đến:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <select onChange={e => setSortType(e.target.value)} value={sortType}>
          <option value="">-- Sắp xếp theo --</option>
          <option value="most">Xem nhiều nhất</option>
          <option value="least">Xem ít nhất</option>
        </select>
      </div>

      <div className="history-list">
        {histories.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          histories.map(history => (
            <div key={history.id} className="history-item">
              <img src={history.thumb_url} alt={history.movie_name} />
              <div>
                <h3>{history.movie_name}</h3>
                <p>Tập: {history.episode_name}</p>
                <p>Thời gian xem: {history.watched_at}</p>
                <a href={history.link_embed} target="_blank" rel="noopener noreferrer">
                  Xem lại
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryAdmin;
