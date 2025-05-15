import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthProvider';
import axiosInstance from '../../../service/axiosInstance';
import Cardfilm from '../../../ultis/user/Cardfilm';
import { FaPlay } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import Buttonllike from '../../../ultis/user/Buttonllike';
import './LikePage.scss'
const LikePage = () => {
  const { user } = useAuth();
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLikedMovies = async () => {
      try {
        // Bước 1: Lấy danh sách slug phim đã like
        const likeRes = await axiosInstance.get(`/api/like/user/${user.id}`);
        const slugs = likeRes.data.data.map(item => item.movie_slug);

        // Bước 2: Gọi từng API lấy chi tiết phim
        const detailPromises = slugs.map(async (slug) => {
          try {
            const res = await axiosInstance.get(`/api/movies/${slug}`);
            return res.data.movie;
          } catch (err) {
            if (err.response?.status === 403) return null;
            console.error(`Lỗi khi lấy phim ${slug}:`, err);
            return null;
          }
        });

        const movies = await Promise.all(detailPromises);
        const filteredMovies = movies.filter(Boolean);

        // Format dữ liệu cho Cardfilm
        const formattedMovies = filteredMovies.map((movie) => ({
          id: movie._id,
          name: movie.name,
          slug: movie.slug,
          poster_url: movie.poster_url.startsWith('http')
            ? movie.poster_url
            : `https://phimimg.com/${movie.poster_url}`,
          thumb: movie.thumb_url.startsWith('http')
            ? movie.thumb_url
            : `https://phimimg.com/${movie.thumb_url}`,
          year: movie.year,
          time: movie.time,
          quality: movie.quality,
          lang: movie.lang,
          episode_current: movie.episode_current
        }));
        console.log("DULIUE", formattedMovies)
        setLikedMovies(formattedMovies);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phim đã like:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedMovies();
  }, [user]);

  if (loading) return <div className="like-page-loading">Đang tải danh sách phim đã thích...</div>;

  return (
    <div className="like-page">
      <h1 className="like-page-title">Phim bạn đã thích</h1>
      {likedMovies.length > 0 ? (
        <div className="movie-grid">
          {likedMovies.map((item) => (
            <div key={item.id} className="movie-item" onClick={() => handleMovieClick(item.movie_slug)}>
              <div className="movie-inner">
                <img src={item.poster_url} alt={item.name} className="movie-poster" />
                <div className="movie-name">{item.name}</div>
                <div className="overlay-buttons">
                  <button className="btn watch-now" onClick={(e) => handleClick(item, e)} ><FaPlay /> Xem ngay</button>
                  <button className="btn detail"><IoIosInformationCircle /> Chi tiết</button>
                  <Buttonllike slug={item.slug} name={item.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="like-page-empty">Bạn chưa thích phim nào.</div>
      )}
    </div>
  );
};

export default LikePage;
