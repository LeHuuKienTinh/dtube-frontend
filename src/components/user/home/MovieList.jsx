import React, { useEffect, useState } from "react";
import axiosInstance from "../../../service/axiosInstance";
import CardFilm from "../../../ultis/user/Cardfilm";
import "./MovieList.scss";


const MovieList = ({ apiUrl, typeSlug, layout }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get(apiUrl);
        const formattedData = res.data.items.map((movie) => ({
          id: movie.id || movie._id,
          poster: movie.poster,
          name: movie.name,
          slug: movie.slug,
        }));
        setMovies(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
      }
    };

    fetchMovies();
  }, [apiUrl]);

  return (
    <div className={`movie-list-wrapper ${layout}`}>
      <CardFilm
        data={movies.slice(0, layout === "horizontal" ? 10 : 24)}
        onLoadMore={() => console.log("Load more clicked")}
      />
    </div>
  );
};

export default MovieList;
