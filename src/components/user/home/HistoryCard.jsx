import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../service/axiosInstance";
import "./HistoryCard.scss";
import { useAuth } from "../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import Buttonllike from "../../../ultis/user/Buttonllike";
import { toast } from 'react-toastify';

const HistoryCard = ({ viewType = "card" }) => {
  const [history, setHistory] = useState([]);
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    axiosInstance
      .get(`/api/historyfilm/history/${userId}`)
      .then((res) => {
        setHistory(res.data)
        console.log("lich su phim", res.data)
      })

      .catch((err) => console.error("Lỗi khi lấy lịch sử phim:", err));
  }, [userId]);

  useEffect(() => {
    if (viewType === "card" && history.length > 0) {
      startAutoScroll();
      return () => stopAutoScroll();
    }
  }, [viewType, history]);

  const startAutoScroll = () => {
    stopAutoScroll(); // Đảm bảo chỉ có một interval chạy
    const container = scrollContainerRef.current;
    if (!container) return;

    scrollIntervalRef.current = setInterval(() => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        // Nếu đã cuộn đến cuối, quay lại đầu
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Cuộn sang phải
        container.scrollBy({ left: 180, behavior: 'smooth' }); // 180px là width của mỗi card
      }
    }, 3000); // Tự động cuộn mỗi 3 giây
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleClick = (item, e) => {
    e.stopPropagation();

    navigate(`/watch/${item.movie_slug}/${item.episode_slug}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      // Gọi API xóa bộ phim
      await axiosInstance.delete(`/api/historyfilm/history/delete/${id}`);
      // Cập nhật lại state sau khi xóa
      setHistory((prev) => prev.filter((item) => item.id !== Number(id)));
      toast.success("Xóa lịch sử thành công");
    } catch (err) {
      console.error("Lỗi khi xóa lịch sử:", err);
    }
  };
  const handleMovieClick = (slug) => {
    navigate(`/trailer/${encodeURIComponent(slug)}`);
  };

  return (
    <div className="history-container">
      <h2 className="history-heading">Nhật ký xem</h2>
      <div className="movie-grid">
        {history.map((item) => (
          <div key={item.id} className="movie-item" onClick={() => handleMovieClick(item.movie_slug)}>
            <div className="movie-inner">
              <img src={item.poster_url} alt={item.name} className="movie-poster" />
              <div className="movie-name">{item.movie_name} - {item.episode_name}</div>
              <div className="overlay-buttons">
                <button className="btn watch-now" onClick={(e) => handleClick(item, e)} ><FaPlay /> Xem ngay</button>
                <button className="btn detail"><IoIosInformationCircle /> Chi tiết</button>
                <button type="button" className="btn detail" onClick={(e) => handleDelete(item.id, e)}><IoIosInformationCircle /> Xóa</button>
                <Buttonllike slug={item.movie_slug} name={item.movie_name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryCard;