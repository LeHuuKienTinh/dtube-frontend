import React, { useState } from "react";
import './CardFilm.scss';
import { useNavigate } from "react-router-dom";
import Buttonllike from "./Buttonllike";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaPlay, FaHeart } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6, slidesToSlide: 4 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 3, slidesToSlide: 3 },
  mobile: { breakpoint: { max: 767, min: 464 }, items: 2, slidesToSlide: 1 }
};

const ITEMS_PER_PAGE = 12; // số phim mỗi trang

const Cardfilm = ({ data = [] }) => {
  const navigate = useNavigate();
  const [likedFilms, setLikedFilms] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm điều hướng khi nhấn vào movie (poster hoặc tên phim)
  const handleMovieClick = (slug) => {
    navigate(`/trailer/${slug}`);
  };

  // Toggle like khi nhấn vào nút like
  const toggleLike = (id) => {
    setLikedFilms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="movie-list-container">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={4000}
        swipeable={true}
        draggable={true}
        infinite={false}
        partialVisible={false}
        arrows={true}
      >
        {currentData.map((item) => (
          <div key={item.id} className="movie-item" onClick={() => handleMovieClick(item.slug)}>
            <div className="movie-inner">
              <img src={item.poster} alt={item.name} className="movie-poster" />
              <div className="movie-name">{item.name}</div>
              <div className="overlay-buttons">
                <button
                  className="btn watch-now"
                >
                  <FaPlay /> Xem ngay
                </button>

                <button
                  className="btn detail"
                >
                  <IoIosInformationCircle /> Chi tiết
                </button>
                <Buttonllike slug={item.slug} name={item.name} />
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cardfilm;
