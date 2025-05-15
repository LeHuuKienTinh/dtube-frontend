
import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaBox,
  FaBell,
  FaFilm,
  FaFlag,
  FaComment,
  FaMoneyBillWave,
  FaMobileAlt,

} from "react-icons/fa";
import "./Admin.scss";
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import { GrVolumeControl } from "react-icons/gr";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import { RiMovie2Fill } from "react-icons/ri";
import { MdReport } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useAuth } from "../../contexts/AuthProvider";

const menuItems = [
  { to: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" },
  { to: "/admin/user", icon: <FaUser />, label: "Quản lý Tài khoản" },
  { to: "/admin/package", icon: <FaBox />, label: "Quản lý Gói Cước" },
  { to: "/admin/notification", icon: <FaBell />, label: "Quản lý thông báo" },
  { to: "/admin/movie", icon: <FaFilm />, label: "Quản lý phim" },
  { to: "/admin/report", icon: <FaFlag />, label: "Quản lý báo cáo" },
  { to: "/admin/comment", icon: <FaComment />, label: "Quản lý bình luận" },
  { to: "/admin/vnpay", icon: <FaMoneyBillWave />, label: "Quản lý VNPay" },
];

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleClick = () => {
    navigate("/"); // Đổi '/watch' thành đường dẫn bạn muốn chuyển hướng đến
  };
  const handleLogOut = () => {
    logout();
    navigate('/login');

  };
  return (
    <div className="admin-wrapper">
      <div className="logo-btn-wrapper">
        <a className="logo-page" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          DTube
        </a>

        <div className="action-buttons">
          <button className="btn-back-watch" onClick={handleClick}><IoArrowBackCircleSharp />Xem Phim</button>
          <button className="btn-logout" onClick={handleLogOut}><IoExitOutline />Đăng xuất</button>
        </div>
      </div>

      <div className="account-layout">
        <aside className="sidebar">
          <NavLink to="/admin/dashboard"><GrVolumeControl size={20} className="me-2" />Dashboard</NavLink>
          <NavLink to="/admin/user"><FaUser size={20} className="me-2" />Quản lý Tài khoản</NavLink>
          <NavLink to="/admin/package"><RiMoneyDollarCircleFill size={20} className="me-2" />Quản lý Gói Cước</NavLink>
          <NavLink to="/admin/notification"> <IoIosNotifications size={20} className="me-2" />Quản lý Thông Báo</NavLink>
          <NavLink to="/admin/movie"> <RiMovie2Fill size={20} className="me-2" />Quản lý Phim</NavLink>
          <NavLink to="/admin/report"> <MdReport size={20} className="me-2" />Quản lý Báo Cáo</NavLink>
          <NavLink to="/admin/comment"> <FaComment size={20} className="me-2" />Quản lý Bình Luận</NavLink>
          <NavLink to="/admin/vnpay"> <FaCreditCard size={20} className="me-2" />Quản lý VNPay</NavLink>
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default NavbarAdmin;
