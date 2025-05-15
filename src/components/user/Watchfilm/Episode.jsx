import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../service/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';  // Added useParams
import './Episode.scss';

const Episode = ({ moviename, onEpisodeSelect }) => {
    const [movieData, setMovieData] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { episodeSlug } = useParams();  // Get current episode slug from URL params

    const formatDuration = (seconds) => {
        if (!seconds) return 'Đang cập nhật';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m} phút ${s} giây`;
    };

    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`/api/movies/${moviename}`)
            .then((response) => {
                if (response.data) {
                    setMovieData(response.data.movie);
                    setEpisodes(response.data.episodes?.[0]?.server_data || []);
                }
            })
            .catch((error) => {
                console.error('Có lỗi khi lấy dữ liệu', error);
            })
            .finally(() => setLoading(false));
    }, [moviename]);

    const handleEpisodeClick = (episode) => {
        navigate(`/watch/${moviename}/${episode.slug || 'tap'}`, {
            state: {
                episode,
                movie: movieData
            }
        });
        if (onEpisodeSelect) onEpisodeSelect(); // Đóng modal
    };

    if (loading) return <div className="loading-screen"><p>Đang tải danh sách tập phim...</p></div>;

    if (!movieData) {
        return (
            <div className="not-found-screen">
                <p>Không tìm thấy thông tin phim.</p>
            </div>
        );
    }

    return (
        <div className="episode-container-watch">
            {movieData && (
                <div className="episode-list">
                    <h2>Danh Sách Tập</h2>
                    {episodes.length > 0 ? (
                        episodes.map((episode, index) => (
                            <div
                                key={index}
                                className={`episode-item ${episode.slug === episodeSlug ? 'current-episode' : ''}`}
                                onClick={() => handleEpisodeClick(episode)}
                            >
                                <img
                                    src={movieData.thumb_url}
                                    alt={episode.name}
                                    className="episode-thumbnail"
                                />
                                <div className="episode-info">
                                    <h3>{episode.name}</h3>
                                    <p>{movieData.name}</p>
                                    {episode.duration && (
                                        <p>Thời lượng: {formatDuration(episode.duration)}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-episodes">Không có tập phim nào.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Episode;