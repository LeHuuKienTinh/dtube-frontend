import { useEffect, useState } from "react";
import axiosInstance from "../../../service/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import './NewPage.scss';
import ListTypeFilm from "../../../ultis/user/ListTypeFilm";
import Pagination from "../home/Pagination";

const ListFilm = () => {
  const { type, page } = useParams(); // Lấy type và page từ URL
  const currentPage = parseInt(page || "1", 10);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMoviesByListType = async () => {
      try {
        const res = await axiosInstance.get(`/api/movies/category/list/${type}/${currentPage}`);
        if (res.data && res.data.data && res.data.data.items) {
          // console.log('Response from API:', res); 
          setMovies(res.data.data.items); // Lưu trữ dữ liệu phim
          setTitle(res.data.data.seoOnPage.descriptionHead)
          setTotalPages(res.data.data.params.pagination.totalPages || 1); // Cập nhật tổng số trang
          console.log("dữ liệu phim", currentPage)
          console.log("dữ liệu phim 1111", res.data.data.params.pagination.totalPages)
        } else {
          console.error("Dữ liệu phim không hợp lệ:", res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phim:", error);
      }
    };

    fetchMoviesByListType();
  }, [type, currentPage]); // Lắng nghe thay đổi type và page

  const handlePageChange = (newPage) => {
    navigate(`/category/list/${type}/${newPage}`);
  };

  return (
    <div className="list-new-film">
      <h1>{title}</h1>
      <ListTypeFilm data={movies} />
      <Pagination currentPage={currentPage} totalPages={totalPages} kind={`category/list/${type}`} onPageChange={handlePageChange} />
    </div>
  );
};

export default ListFilm;
