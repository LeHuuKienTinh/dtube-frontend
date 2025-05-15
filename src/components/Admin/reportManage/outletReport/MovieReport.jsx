import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../service/axiosInstance';
import './MovieReport.scss';
import { useNavigate } from 'react-router-dom';

const MovieReport = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovieReports();
        fetchUser();
    }, []);

    const fetchMovieReports = async () => {
        try {
            // Lấy tất cả báo cáo phim
            const res = await axiosInstance.get('/api/reports/type/1');
            setReports(res.data.reports || []);
            console.log("iinforppp", res.data.reports)
        } catch (err) {
            console.error('Lỗi khi lấy báo cáo phim:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get('/api/admin/users')
            setUsers(res.data.users)
            console.log("nguoi dung", res.data.users)
        } catch (err) {
            console.error('Lỗi khi lấy ds người dùng:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleMarkProcessed = async (link) => {
        window.open(link, '_blank'); // mở tab mới
    };

    const handleChangeProcessed = async (id) => {
        try {
            await axiosInstance.put(`/api/reports/${id}/status`, { status: 1 });
            setReports(prev =>
                prev.map(rep =>
                    rep.id_report === id ? { ...rep, status: 1 } : rep
                )
            );
        } catch (err) {
            console.error('Lỗi khi cập nhật trạng thái:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/reports/delete/${id}`);
            setReports(r => r.filter(rep => rep.id_report !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (reports.length === 0) return <p>Chưa có báo cáo phim.</p>;

    return (
        <div className="report-movie-wrapper">
            <h2 className='title-report-movie'>Danh sách Báo cáo Phim</h2>
            <table className="report-movie-table">
                <thead>
                    <tr>
                        <th className='text-center'>STT</th>
                        <th className='text-center'>Tên Phim</th>
                        <th className='text-center'>Nội dung báo cáo</th>
                        <th className='text-center'>Người báo cáo</th>
                        <th className='text-center'>Ngày báo cáo</th>
                        <th className='text-center'>Trạng thái</th>
                        <th className='text-center'>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((r, index) => (
                        <tr key={index + 1}>
                            <td className='text-center'>{index + 1}</td>
                            <td>{r.movie_name}</td>
                            <td className="report-desc">{r.despcript}</td>
                            <td>
                                {users.find(u => u.id === r.id_user)?.name || r.id_user}
                            </td>
                            <td>{new Date(r.created_at).toLocaleString()}</td>
                            <td className='yes-no-firm text-center'>
                                {r.status === 0 ? (
                                    <button
                                        className="btn-status-pending"
                                        onClick={() => handleChangeProcessed(r.id_report)}
                                    >
                                        Chưa xử lý
                                    </button>
                                ) : (
                                    <button className="btn-status-processed" disabled>
                                        Đã xử lý
                                    </button>
                                )}
                            </td>
                            <td className="actions text-center">
                                {r.status === 0 && (
                                    <button className='btn-firm' onClick={() => handleMarkProcessed(r.navigate)}>
                                        Xem xét
                                    </button>
                                )}
                                <button className='btn-delete' onClick={() => handleDelete(r.id_report)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MovieReport;
