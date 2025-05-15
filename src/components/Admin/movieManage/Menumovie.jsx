import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menumovie.scss';

const Menumovie = () => {
  const menus = [
    { name: 'Danh Sách Phim', to: '/admin/movie/list' },
    { name: 'Danh sách Phim Cấm', to: '/admin/movie/banfilm' },
    { name: 'Quản Lý Lượt Xem', to: '/admin/movie/view' },
    { name: 'Quản Lý Yêu Thích', to: '/admin/movie/like' },
  ];

  return (
    <div className="menu-container-movie">
      <table className="menu-table">
        <tbody>
          <tr>
            {menus.map((item, idx) => (
              <td key={idx} className="menu-td">
                <NavLink className="menu-link" to={item.to}>
                  {item.name}
                </NavLink>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Menumovie;
