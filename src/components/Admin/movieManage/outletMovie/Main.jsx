import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../service/axiosInstance';
import './Main.scss';
import { FaBan } from "react-icons/fa6";

let typingTimer;

const Main = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [bannedMovies, setBannedMovies] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [banData, setBanData] = useState({ slug: '', title: '', description: '', id: '' });

  const domainCdn = 'https://img.phimapi.com';

  const performSearch = async (keyword) => {
    if (!keyword.trim()) return;
    setLoading(true);
    setNoResults(false);
    try {
      const res = await axiosInstance.get('/api/movies/search', {
        params: { keyword: keyword.trim() },
      });
      const { items = [] } = res.data;

      const mapped = items.map(m => {
        const isBanned = bannedMovies.some(b => b.slug === m.slug || b.id === m._id);
        return {
          id: m._id,
          name: m.name,
          slug: m.slug,
          posterUrl: m.poster_url ? `${domainCdn}/${m.poster_url}` : 'default-image.jpg',
          isBanned: isBanned
        };
      });

      setFilms(mapped);
      setNoResults(mapped.length === 0);
    } catch (err) {
      console.error(err);
      setFilms([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(typingTimer);
    if (searchQuery.trim()) {
      typingTimer = setTimeout(() => {
        performSearch(searchQuery);
      }, 500);
    } else {
      setFilms([]);
    }
    return () => clearTimeout(typingTimer);
  }, [searchQuery]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch(searchQuery);
    }
  };

  const handleOpenBanModal = (film) => {
    setBanData({ name: film.name, slug: film.slug, title: film.name, description: '', id: film.id });
    setShowModal(true);
  };

  const handleBanMovie = async () => {
    try {
      // Gửi yêu cầu POST đến API để cấm phim
      await axiosInstance.post('/api/admin/banmovie', {
        slug: banData.slug,
        title: banData.title,
        description: banData.description
      });
      setFilms(prev =>
        prev.map(f => f.id === banData.id ? { ...f, isBanned: true } : f)
      );

      setBannedMovies(prev => [...prev, { id: banData.id, slug: banData.slug }]);

      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Không thể cấm phim. Vui lòng thử lại.");
    }
  };
  useEffect(() => {
    const fetchBannedMovies = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/banmovie');
        setBannedMovies(response.data);
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu phim bị cấm');
        console.error(err);
      }
    };

    fetchBannedMovies();
  }, []);

  return (
    <div className="main-page-ban">
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Nhập tên phim..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className='search-film'
          />
        </div>

        {noResults && <p className="no-result">Không có kết quả.</p>}

        <div className="film-list">
          {films.map(film => (
            <div key={film.id} className="film-item">
              <img src={film.posterUrl} alt={film.name} />
              <span>{film.name}</span>
              {film.isBanned ? (
                <button disabled className="banned-btn">Đã bị cấm</button>
              ) : (
                <button onClick={() => handleOpenBanModal(film)}>
                  <FaBan />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-ban" onClick={e => e.stopPropagation()}>
            <h3>Cấm phim</h3>
            <p><strong>Tên phim:</strong> {banData.name}</p>
            <p><strong>Slug:</strong> {banData.slug}</p>
            <input
              type="text"
              placeholder="Nhập lý do cấm..."
              value={banData.description}
              onChange={e => setBanData(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Hủy</button>
              <button onClick={handleBanMovie}>Xác nhận Cấm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
