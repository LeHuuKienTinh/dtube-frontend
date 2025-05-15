import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../service/axiosInstance";
import Hls from "hls.js";
import { FaArrowLeft, FaComment, FaFilm, FaInfoCircle } from "react-icons/fa";
import Comments from "../Watchfilm/Comments";
import "./Watchfilm.scss";
import { useAuth } from "../../../contexts/AuthProvider";
import Episode from "../Watchfilm/Episode.jsx";
import ReportEpisode from "../Watchfilm/ReportEpisode.jsx";
const Watchfilm = () => {
  const { movieName, episodeSlug } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [videoSrc, setVideoSrc] = useState("");
  const [movie, setMovie] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showEpisode, setShowEpisode] = useState(false);
  const [showReportEpisode, setShowReportEpisode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  // Thêm state để đảm bảo chỉ gọi 1 lần
  const [hasIncreasedView, setHasIncreasedView] = useState(false);

  useEffect(() => {
    const increaseView = async () => {
      if (movie && episode && currentTime >= 1 && !hasIncreasedView) {
        try {
          await axiosInstance.post("/api/view/increase", {
            movie_slug: movie.slug,
            episode_slug: episode.slug,
            movie_name: movie.name,
            episode_number: episode.name
          });
          console.log("✅ Đã tăng lượt xem");
          console.log("epiii", episode)
          setHasIncreasedView(true); // Đánh dấu đã gọi
        } catch (error) {
          console.error("❌ Lỗi khi tăng lượt xem:", error);
        }
      }
    };

    increaseView();
  }, [movie, episode, currentTime, hasIncreasedView]);
  const formatTime = useCallback((seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  // Fetch movie & episode data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(`/api/movies/${movieName}`);
        const { movie, episodes } = res.data;
        console.log('dulieu', movie)
        setMovie(movie);
        const found = episodes
          .flatMap((ep) => ep.server_data)
          .find((e) => e.slug === episodeSlug);
        if (!found) throw new Error("Không tìm thấy tập phim");
        setEpisode(found);
        setVideoSrc(found.link_m3u8 || "");
        console.log("epiiiii", episode)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      setHasIncreasedView(false);
    };
    fetchData();
  }, [movieName, episodeSlug]);

  // Initialize HLS and attach media
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    // Cleanup existing HLS
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (video.duration) setDuration(Math.floor(video.duration));
        video.play().catch((e) => console.warn("Autoplay failed:", e));
      });
      hls.on(Hls.Events.ERROR, (_, data) => console.error("HLS error", data));
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoSrc]);

  const toggleComments = () => setShowComments((prev) => !prev);
  const toggleEpisode = () => setShowEpisode((prev) => !prev);
  const toggleReportEpisode = () => setShowReportEpisode((prev) => !prev);

  // Function to post watch history when video starts
  useEffect(() => {
    const postWatchHistory = async () => {
      if (authUser && movie && episode && currentTime === 0) {
        const data = {
          user_id: authUser.id,
          movie_slug: movie.slug,
          episode_name: episode.name,
          episode_slug: episode.slug,
          watched_at: new Date().toISOString(),
        };

        try {
          await axiosInstance.post("/api/historyfilm/history", data);
        } catch (err) {
          console.error("Error posting watch history:", err);
        }
      }
    };

    postWatchHistory();
  }, [authUser, movie, episode, currentTime]);

  // if (!loading)
  //   return <div className="watchfilm-loading">⏳ Đang tải dữ liệu...</div>;
  if (error)
    return (
      <div className="watchfilm-error">
        <p>❌ Lỗi: {error}</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  return (
    <div className="watchfilm-container">
      <div className="watchfilm-header">
        <h1>
          <span>
            {movie?.name} - {episode?.name}
          </span>
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </h1>
      </div>

      <div className="icon-column left-column">
        <button className="icon-button" onClick={() => navigate(`/trailer/${movie.slug}`)}>
          <FaArrowLeft />
        </button>
      </div>

      <div className="icon-column right-column">
        <button className="icon-button" onClick={toggleEpisode}>
          <FaFilm />
        </button>
        <button className="icon-button" onClick={toggleComments}>
          <FaComment />
        </button>
        <button className="icon-button" onClick={toggleReportEpisode}>
          <FaInfoCircle />
        </button>
      </div>

      {videoSrc ? (
        <video
          key={videoSrc}
          ref={videoRef}
          controls
          className="watchfilm-video"
          autoPlay
          playsInline
          muted
          onTimeUpdate={(e) =>
            setCurrentTime(Math.floor(e.currentTarget.currentTime))
          }
          onLoadedMetadata={(e) =>
            setDuration(Math.floor(e.currentTarget.duration))
          }
        />
      ) : (
        <div className="watchfilm-loading">Đang tải phim...</div>
      )}

      {showComments && (
        <div className="comments-overlay" onClick={toggleComments}>
          <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
            <Comments
              currentTime={currentTime}
              movieSlug={movieName}
              episodeSlug={episode.slug}
              moviename={movie.name}
              movieslug={movie.slug}
              episodecurrently={episode?.name}
            />
          </div>
        </div>
      )}
      {showEpisode && (
        <div className="comments-overlay-eps" onClick={toggleEpisode}>
          <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
            <Episode moviename={movieName} episodecurrently={episode?.slug} onEpisodeSelect={() => setShowEpisode(false)} />
          </div>
        </div>
      )}
      {showReportEpisode && (
        <div className="comments-overlay-report" onClick={() => setShowReportEpisode(false)}>
          <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
            <ReportEpisode
              moviename={movie.name}
              movieslug={movie.slug}
              episodecurrently={episode?.name}
              setShowReportEpisode={setShowReportEpisode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchfilm;
