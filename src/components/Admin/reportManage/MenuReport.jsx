import React from 'react';
import { NavLink } from 'react-router-dom';
import './MenuReport.scss';

const MenuReport = () => {
    const menus = [
        { name: 'Báo cáo Phim', to: '/admin/report/movie' },
        { name: 'Báo cáo Tập Phim', to: '/admin/report/episode' },
        { name: 'Báo cáo Bình luận', to: '/admin/report/comment' },
    ];

    return (
        <div className="menu-container-report">
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

export default MenuReport;
