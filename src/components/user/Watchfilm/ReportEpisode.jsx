// ReportEpisode.jsx
import React, { useState } from "react";
import axiosInstance from "../../../service/axiosInstance";
import { useAuth } from "../../../contexts/AuthProvider";
import './ReportEpisode.scss'

const ReportEpisode = ({ moviename, episodecurrently, episodeName, setShowReportEpisode, movieslug }) => {
    const { user } = useAuth();
    const [description, setDescription] = useState("");
    const [navigateUrl, setNavigateUrl] = useState(window.location.pathname);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError("Vui lòng nhập mô tả vấn đề");
            return;
        }

        try {
            await axiosInstance.post("/api/reports/create", {
                id_user: user.id,
                id_type_comment: 2, // 2 là báo cáo tập phim
                movie_slug: movieslug,
                movie_name: moviename,
                episode_name: episodecurrently,
                despcript: description,
                navigate: navigateUrl,
            });
            setSuccess(true);
            setError("");
        } catch (err) {
            console.error("Lỗi khi gửi báo cáo:", err);
            setError("Không thể gửi báo cáo. Vui lòng thử lại.");
        }
    };

    return (
        <div className=".report-modal-overlay">
            <div className="report-modal">
                <h3>Báo cáo tập phim</h3>
                {success ? (
                    <p className="success-message">✅ Cảm ơn bạn đã báo cáo! Chúng tôi sẽ xem xét sớm nhất.</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả lỗi của tập phim..."
                            rows={5}
                        />
                        {error && <p className="error-message">{error}</p>}
                        <div className="modal-actions">
                            <button className="cancel-btn" type="button" onClick={() => setShowReportEpisode(false)}>Đóng</button>
                            <button className="submit-btn" type="submit">Gửi báo cáo</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReportEpisode;
