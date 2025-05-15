import React, { useState, useRef, useEffect } from "react";
import "./Menu.scss";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaHome,
  FaFilm,
  FaStar,
  FaLanguage,
  FaListUl,
  FaFire,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthProvider";
import aiIcon from "../../assets/aiicon.png";
import Chatbot from "../../components/user/outlet/Chatbot";
import axiosInstance from '../../../src/service/axiosInstance';

const Menu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showBellModal, setShowBellModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef();
  const bellModalRef = useRef();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const toggleDrawer = () => setShowDrawer((prev) => !prev);
  const handleLogout = () => {
    logout();
    navigate('/login');

  };

  const toggleBellModal = () => setShowBellModal((prev) => !prev);

  const fetchNotifications = () => {
    const fetchedNotifications = [
      { id: 1, message: "Bạn có một tin nhắn mới!" },
      { id: 2, message: "Đã có cập nhật mới cho phim yêu thích." },
      { id: 3, message: "Mời bạn tham gia cuộc thi mới!" },
    ];
    setNotifications(fetchedNotifications);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setShowSearch((prev) => !prev);
    }
  };

  useEffect(() => {
    if (showBellModal) fetchNotifications();
  }, [showBellModal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellModalRef.current && !bellModalRef.current.contains(e.target)) {
        setShowBellModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showDrawer ? "hidden" : "auto";
  }, [showDrawer]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/api/movies/allcategory/');
        setCategories(res.data.categories);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thể loại:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="menu-container">
      <div className="menu-left">
        <Link to="/" className="logo">DTube</Link>
        <Link to="/" className="menu-link"><span>Trang chủ</span><FaHome /></Link>
        <Link to="/like" className="menu-link"><span>Yêu Thích</span><FaFilm /></Link>
        <Link to="/category/list/phim-bo/1" className="menu-link"><span>Phim bộ</span><FaFire /></Link>
        <Link to="/category/list/phim-le/1" className="menu-link"><span>Phim lẻ</span><FaListUl /></Link>
        <Link to="/alltype" className="menu-link">
          <span>Thể Loại</span>
          <FaStar />
          <div className="dropdown-menu">
            {categories.map((cat, index) => (
              <Link to={`/type/${cat.slug}/1`} key={index} className="category-button">
                {cat.name}
              </Link>
            ))}
          </div>
        </Link>
        <Link to="/allcontry" className="menu-link"><span>Quốc Gia</span><FaLanguage /></Link>
      </div>

      <div className="menu-right">
        <button className="icon-button" onClick={toggleDrawer}><img src={aiIcon} alt="Goat Assistant" /></button>
        <div className="search-container-menu">
          <input
            type="text"
            className={`search-input ${showSearch ? "active" : ""}`}
            placeholder="Tìm kiếm phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <FaSearch className="icon" onClick={handleSearchClick} />
        </div>
        <button className="icon-button" onClick={toggleBellModal}><FaBell /></button>

        <div className="user-dropdown">
          <FaUser />
          <div className="dropdown-menu">
            {/* <Link to="/admin" className="dropdown-item"> {JSON.parse(localStorage.getItem('user'))?.type === "1"
              ? "ADMIN"
              : JSON.parse(localStorage.getItem('user'))?.name}</Link> */}
            {JSON.parse(localStorage.getItem('user'))?.type !== "1"
              ?
              <Link to="/account/profiles" className="dropdown-item">{JSON.parse(localStorage.getItem('user'))?.name}</Link>
              :
              <Link to="/admin/dashboard" className="dropdown-item">ADMIN</Link>}
            <Link to="/history" className="dropdown-item">Lịch sử</Link>
            <Link to="/support" className="dropdown-item">Trợ giúp</Link>
            <hr style={{ margin: '0', backgroundColor: 'white' }} />
            <Link to="/" onClick={handleLogout} className="dropdown-item logout-btn">Đăng xuất</Link>
          </div>
        </div>
      </div>

      {showDrawer && <div className="chatbot-overlay" onClick={toggleDrawer}></div>}

      <div className={`chatbot-drawer ${showDrawer ? "open" : ""}`}>
        <div className="chatbot-header">
          <h3>Xin chào mình là <strong>Goati</strong> 🐐</h3>
          <button className="chatbot-close-btn" onClick={toggleDrawer}>Đóng</button>
        </div>
        <div className="chatbot-body">
          <Chatbot />
        </div>
      </div>

      {showBellModal && (
        <div className="bell-modal-overlay" onClick={toggleBellModal}>
          <div className="bell-modal" ref={bellModalRef} onClick={e => e.stopPropagation()}>
            <h3>Thông báo</h3>
            <button onClick={toggleBellModal} className="bell-modal-close-btn">Đóng</button>
            <div className="bell-modal-content">
              {notifications.length === 0 ? (
                <p>Không có thông báo mới.</p>
              ) : (
                <ul>
                  {notifications.map((n) => <li key={n.id}>{n.message}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Menu;
