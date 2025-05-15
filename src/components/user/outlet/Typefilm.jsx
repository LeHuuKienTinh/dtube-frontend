import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Menu from '../../../view/user/Menu';
import Cardfilm from '../../../ultis/user/Cardfilm';
import './Typefilm.scss';
import axiosInstance from '../../../service/axiosInstance';
import ListTypeFilm from '../../../ultis/user/ListTypeFilm';
import Pagination from '../home/Pagination';


const Typefilm = () => {
  const { kind, page } = useParams();
  const [movies, setMovies] = useState([]);
  const [newmovies, setNewMovies] = useState([]);
  const currentPage = parseInt(page) || 1;
  const pageRefs = useRef([]);
  const [title, setTitle] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get(`/api/movies/category/${kind}/${currentPage}`);
        const formattedMovies = res.data.items.map((movie) => ({
          id: movie.id,
          name: movie.name,
          thumb: movie.thumb,
          poster_url: movie.poster,
          slug: movie.slug || movie.id,
        }));
        setMovies(formattedMovies);
        setTitle(res.data.title)
        setTotalPages(res.data.totalPage)
        // console.log("dulieuaaa", res.data)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchMovies();
  }, [kind, currentPage]);

  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        const res = await axiosInstance.get(`/api/movies/latest/${page}`);

        if (res.data && res.data.items) {
          setNewMovies(res.data.items); // Lưu trữ dữ liệu phim
          console.log("tren", res)
        } else {
          console.error("Dữ liệu phim không hợp lệ:", res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phim mới nhất:", error);
      }
    };

    fetchLatestMovies();
  }, [page]); // Mỗi khi page thay đổi sẽ gọi lại API

  useEffect(() => {
    const activeRef = pageRefs.current[currentPage - 1];
    if (activeRef) {
      activeRef.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    navigate(`/type/${kind}/${newPage}`);
  };
  return (
    <div className="typefilm-page">
      <div className="row">
        <div className="col-lg-8">
          <h1>{title} </h1>
          <ListTypeFilm data={movies} layout="grid" />
          <Pagination currentPage={currentPage} totalPages={totalPages} kind={`category/list/${kind}`} onPageChange={handlePageChange}></Pagination>
        </div>
        <div className="col-lg-4 trending-movies">
          <h5>Hiện Đang Thịnh Hành</h5>
          {newmovies.slice(0, 7).map((newmovies) => (
            <div key={newmovies.id} className="trending-item" onClick={() => handleMovieClick(newmovies.slug)}>
              <img src={newmovies.thumb} alt={newmovies.name} />
              <div className="trending-info">
                <h6>{newmovies.name}</h6>
                <p>{newmovies.current}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Typefilm;
