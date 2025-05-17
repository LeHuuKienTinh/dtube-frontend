import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../service/axiosInstance'; // hoặc đường dẫn đúng với project của bạn
import './Banfilm.scss';
import { toast } from 'react-toastify';

const Banfilm = () => {
  const [bannedMovies, setBannedMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBannedMovies = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/banmovie');
        setBannedMovies(response.data);
        setFilteredMovies(response.data);
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu phim bị cấm');
        console.error(err);
      }
    };

    fetchBannedMovies();
  }, []);

  const unbanMovie = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/banmovie/${id}`);
      setBannedMovies(prev => prev.filter(movie => movie.id !== id));
      setFilteredMovies(prev => prev.filter(movie => movie.id !== id));
      toast.success("Bỏ cấm phim thành công!")
    } catch (err) {
      toast.error("Có lỗi xảy ra!")
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = bannedMovies.filter(movie =>
      movie.title.toLowerCase().includes(term) || movie.description.toLowerCase().includes(term)
    );
    setFilteredMovies(filtered);
  };

  return (
    <div className="banfilm-container">


      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên phim hoặc mô tả..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      {filteredMovies.length === 0 ? (
        <p>Không có phim bị cấm nào.</p>
      ) : (
        <table className="movie-ban-table">
          <thead>
            <tr>
              <th>Tên phim</th>
              <th>Mô tả lí do cấm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.map((movie) => (
              <tr key={movie.id}>
                <td title={movie.title}>{movie.title}</td>
                <td title={movie.description}>{movie.description}</td>
                <td>
                  <button className="unban-btn" onClick={() => unbanMovie(movie.id)}>
                    Bỏ cấm
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Banfilm;
