import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import './Country.scss';
import axiosInstance from '../../../service/axiosInstance';
import ListTypeFilm from '../../../ultis/user/ListTypeFilm';
import Pagination from '../home/Pagination';

const Country = () => {
  const { slug, page } = useParams();
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [countryName, setCountryName] = useState('');
  const currentPage = parseInt(page) || 1;
  const pageRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get(`/api/movies/country/${slug}?page=${currentPage}`);
        setMovies(res.data.data.items);
        setTitle(res.data.data.seoOnPage.titleHead)
        setTotalPages(res.data.data.params.pagination.totalPages);
        if (res.data.data.items.length > 0) {
          setCountryName(res.data.data.items[0].country[0].name);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchMovies();
  }, [slug, currentPage]);

  useEffect(() => {
    const activeRef = pageRefs.current[currentPage - 1];
    if (activeRef) {
      activeRef.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [currentPage]);

  const formattedMovies = movies.map((movie) => ({
    id: movie._id,
    name: movie.name,
    poster: `https://phimimg.com/${movie.thumb_url}`,
    slug: movie.slug,
    poster_url: `https://phimimg.com/${movie.poster_url}`,
    year: movie.year,
    time: movie.time,
    quality: movie.quality,
    lang: movie.lang,
    episode_current: movie.episode_current
  }));
  const handlePageChange = (newPage) => {
    navigate(`/country/${slug}/${newPage}`);
  };
  return (
    <div className="country-page">
      <h1>{title}</h1>
      <ListTypeFilm data={formattedMovies} layout="grid" />
      <Pagination currentPage={currentPage} totalPages={totalPages} kind={`country/list/${slug}`} onPageChange={handlePageChange} />

    </div>
  );
};

export default Country;
