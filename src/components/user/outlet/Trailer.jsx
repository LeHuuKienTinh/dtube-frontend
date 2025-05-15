import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';
import './Trailler.scss';
import { useAuth } from '../../../contexts/AuthProvider';
import { IoIosInformationCircle } from "react-icons/io";

const Trailer = () => {
  const { movieName } = useParams();
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportStatus, setReportStatus] = useState(null); // 'success', 'error'

  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportContent) {
      alert('Vui lòng nhập nội dung báo cáo');
      return;
    }

    try {
      await axiosInstance.post('/api/reports/create', {
        id_user: user.id,
        id_type_comment: 1,  // Giả sử báo cáo này là báo cáo phim
        movie_slug: movie.slug,
        movie_name: movie.name,
        despcript: reportContent,
        navigate: window.location.href,
        status: 0
      });
      setReportStatus('success');
      setShowReportModal(false);  // Đóng modal sau khi gửi báo cáo thành công
      console.log(movie.name)
    } catch (err) {
      setReportStatus('error');
      console.error('Lỗi khi gửi báo cáo:', err);
    }
  };

  const handleReportChange = (e) => {
    setReportContent(e.target.value);
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} phút ${s} giây`;
  };

  const handleEpisodeWatch = (episode) => {
    if (!user) {
      alert('Vui lòng đăng nhập để xem phim');
      return;
    }

    navigate(`/watch/${movieName}/${episode.slug || 'tap'}`, {
      state: {
        episode,
        movie,
        user
      }
    });
  };

  const handleContinueWatch = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để xem phim');
      return;
    }

    try {
      const res = await axiosInstance.get(`/api/historyfilm/last/${user.id}/${movieName}`);
      const lastWatched = res.data.episode;
      let epToWatch = episodes.find(ep => ep.slug === lastWatched?.episode_slug) || episodes[0];

      if (epToWatch) {
        handleEpisodeWatch(epToWatch);
      } else {
        alert('Không tìm thấy tập phim phù hợp');
      }
    } catch (err) {
      console.error('Lỗi khi xử lý tiếp tục xem:', err);
    }
  };

  useEffect(() => {
    axiosInstance.get(`/api/movies/${movieName}`)
      .then(res => {
        const { movie, episodes } = res.data;
        console.log("đây là chi tiết phim", movie);
        setMovie(movie);
        setEpisodes(episodes?.[0]?.server_data || []);
        setTrailerUrl(movie?.trailer_url || '');
      })
      .catch(err => {
        console.error('Lỗi khi tải dữ liệu phim:', err);
      })
      .finally(() => setLoading(false));
  }, [movieName]);

  if (loading) return <div className="loading-screen"><p>Đang tải dữ liệu...</p></div>;

  if (!movie) {
    return (
      <div className="not-found-screen">
        <p>Không tìm thấy thông tin phim.</p>
      </div>
    );
  }

  return (
    <div className="trailer-container">
      <div className="banner" style={{ backgroundImage: `url(${movie.thumb_url})` }}>
        <div className="banner-content">
          {trailerUrl.includes('youtube.com') && (
            <div className="trailer-iframe">
              <iframe
                src={trailerUrl.replace("watch?v=", "embed/")}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <div className='movie-detail'>
            <h1>{movie.name}</h1>
            <p className='movie-content'>{movie.content}</p>
            <div className='btn-group'>
              <button className='watch-button' onClick={handleContinueWatch}> Tiếp tục xem</button>
              <IoIosInformationCircle className='report-button' onClick={handleReportClick} />
            </div>
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="report-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Báo cáo phim</h2>
            <textarea
              placeholder="Nội dung báo cáo..."
              rows={5}
              value={reportContent}
              onChange={handleReportChange}
            ></textarea>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowReportModal(false)}>Hủy</button>
              <button className="submit-btn" onClick={handleReportSubmit}>Gửi</button>
            </div>
          </div>
        </div>
      )}

      <div className="episode-list">
        <h2>Danh Sách Tập</h2>
        {episodes.length > 0 ? episodes.map((ep, idx) => (
          <div key={idx} className="episode-item">
            <img src={movie.thumb_url} alt={ep.name} />
            <div className="episode-info">
              <h3>{ep.name}</h3>
              <p>{movie.name}</p>
              {ep.duration && <p>Thời lượng: {formatDuration(ep.duration)}</p>}
              <button className='btn-watch' onClick={() => handleEpisodeWatch(ep)}>Xem</button>
            </div>
          </div>
        )) : <p>Không có tập nào.</p>}
      </div>
    </div>
  );
};

export default Trailer;
