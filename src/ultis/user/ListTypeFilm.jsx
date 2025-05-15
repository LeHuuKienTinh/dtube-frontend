import React, { useEffect, useState } from "react";
import "./ListTypeFilm.scss";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate và useParams
import { FaPlay, FaHeart } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import axiosInstance from "../../../src/service/axiosInstance"; // Đảm bảo axiosInstance đã được cấu hình
import Buttonllike from "./Buttonllike";

const ITEMS_PER_PAGE = 12; // số lượng phim mỗi trang

const ListTypeFilm = ({ data = [] }) => {
    const navigate = useNavigate();
    const [likedFilms, setLikedFilms] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const { page = 1 } = useParams();
    const [movies, setMovies] = useState([]);



    const handleMovieClick = (slug) => {
        navigate(`/trailer/${encodeURIComponent(slug)}`);
    };

    const toggleLike = (id) => {
        setLikedFilms((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const currentData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    return (
        <div className="movie-grid-container">
            <div className="movie-grid">
                {currentData.map((item) => (
                    <div key={item.id} className="movie-item" onClick={() => handleMovieClick(item.slug)}>
                        <div className="movie-inner">
                            <img
                                src={
                                    item.poster_url.startsWith("http")
                                        ? item.poster_url
                                        : `https://phimimg.com/${item.poster_url}`
                                }
                                alt={item.name}
                                className="movie-poster"
                            />
                            <div className="movie-name">{item.name}</div>
                            <div className="overlay-buttons">
                                <button className="btn watch-now"><FaPlay /> Xem ngay</button>
                                <button className="btn detail"><IoIosInformationCircle /> Chi tiết</button>
                                <Buttonllike slug={item.slug} name={item.name} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListTypeFilm;
