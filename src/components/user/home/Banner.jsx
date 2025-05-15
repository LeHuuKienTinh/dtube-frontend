
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../service/axiosInstance";
import "./Banner.scss";

const Banner = () => {
      // State cho danh sách phim
  const [movies, setMovies] = useState([]);
  const scrollRef = useRef(null);
  
  // State cho banner
  const [currentBanner, setCurrentBanner] = useState(0);
  const [bannerMovies, setBannerMovies] = useState([]);

  // Lấy danh sách phim từ API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get("/api/movies/latest/2");
        const formattedData = res.data.items.map((movie) => ({
          id: movie._id,
          poster: movie.poster,
          name: movie.name,
          slug: movie.slug,
          description: movie.description || "No description available",
          year: movie.release_year || "N/A",
          rating: movie.rating || "TV-MA",
          genres: movie.genres?.join(", ") || "Genre not specified",
        }));
        
        setMovies(formattedData);
        // Lấy 3 phim đầu tiên làm banner
        setBannerMovies(formattedData.slice(0, 3));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
      }
    };

    fetchMovies();
  }, []);

  // Tự động chuyển banner sau mỗi 5s
  useEffect(() => {
    if (bannerMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerMovies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerMovies.length]);

  // Xử lý scroll ngang
  useEffect(() => {
    const handleWheelScroll = (event) => {
      if (scrollRef.current) {
        event.preventDefault();
        scrollRef.current.scrollLeft += event.deltaY * 2;
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleWheelScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);
  return (
 
    <div className="movie-list-with-banner">
      {/* Banner section */}
      {bannerMovies.length > 0 && (
        <div 
          className="banner-container"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%), url(${bannerMovies[currentBanner]?.poster})` 
          }}
        >
          <div className="banner-content">
            <div className="banner-title">
              <h1>{bannerMovies[currentBanner]?.name}</h1>
              <div className="banner-meta">
                <span className="match">98% Match</span>
                <span className="year">{bannerMovies[currentBanner]?.year}</span>
                <span className="rating">{bannerMovies[currentBanner]?.rating}</span>
                <span className="season">Season 1</span>
              </div>
              <p className="announcement">New Episodes Coming Soon</p>
              <p className="description">{bannerMovies[currentBanner]?.description}</p>
              
              <div className="banner-actions">
                <button className="play-button">PLAY</button>
                <button className="add-button">+ MY LIST</button>
              </div>
              
              <div className="banner-info">
                <p><strong>Starring:</strong> {bannerMovies[currentBanner]?.stars || "Unknown"}</p>
                <p><strong>Genres:</strong> {bannerMovies[currentBanner]?.genres}</p>
                <p><strong>This show is:</strong> <span className="tag">Exciting</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Banner
