import React, { useState } from "react";
import "./Account.scss";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FaHome,
  FaIdCard,
  FaShieldAlt,
  FaMobileAlt,
  FaRegSmile,
  FaSignOutAlt,
  FaFilm,
  FaBars,
} from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoTimeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    console.log("Đăng xuất...");
    window.location.href = "/login";
  };

  const handleClick = () => {
    navigate("/"); // Đổi '/watch' thành đường dẫn bạn muốn chuyển hướng đến
  };

  return (

    <div className="account-wrapper">
      <div className="logo-btn-wrapper">
        <a className="logo-page" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          DTube
        </a>
        <button className="btn-back-watch" onClick={handleClick}><IoExitOutline />Xem Phim</button>
      </div>
      <div className="account-layout">
        <aside className="sidebar">
          <NavLink to="/account/profiles"><CgProfile size={20} className="me-2" />Hồ sơ</NavLink>
          <NavLink to="/account/time"><IoTimeOutline size={20} className="me-2" />Thời gian</NavLink>
          <NavLink to="/account/security"><FaShieldAlt size={20} className="me-2" />Bảo mật</NavLink>
          <NavLink to="/account/devices"> <FaMobileAlt size={20} className="me-2" />Thiết bị</NavLink>
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Account;
