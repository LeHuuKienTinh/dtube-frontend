// Comments.jsx
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from "../../../service/axiosInstance";
import { useAuth } from '../../../contexts/AuthProvider';
import moment from 'moment';
import './Comments.scss';
import { toast } from 'react-toastify';

const Comments = ({ currentTime, movieSlug, episodeSlug, moviename, episodecurrently, movieslug }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [badWords, setBadWords] = useState([]);
  // For report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportCommentId, setReportCommentId] = useState(null);
  const [reportDesc, setReportDesc] = useState('');
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const containerRef = useRef(null);
  const commentsEndRef = useRef(null);
  const { user } = useAuth();

  // Fetch comments & bad words
  useEffect(() => {
    containerRef.current?.classList.add('mounted');
    fetchComments();
    fetchBadWords();
  }, [movieSlug, episodeSlug]);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/api/comments/${movieSlug}/${episodeSlug}`);
      const processed = res.data.map(c => ({
        ...c,
        time_film: convertToMMSS(c.time_film),
        timeInSeconds: timeStringToSeconds(c.time_film),
      }));
      setComments(processed);
      console.log("datacomemnt", res.data)
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBadWords = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/badwords');
      setBadWords(res.data.map(w => w.word.toLowerCase()));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments, viewMode]);

  // Helpers
  const timeStringToSeconds = t => t.split(':').reverse().reduce((acc, v, i) => acc + v * [1, 60, 3600][i], 0);
  const secondsToMMSS = s => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(Math.floor(s % 60)).padStart(2, '0');
    return `${m}:${sec}`;
  };
  const convertToMMSS = str => secondsToMMSS(timeStringToSeconds(str));
  const secondsToHHMMSS = s => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0'),
      m = String(Math.floor((s % 3600) / 60)).padStart(2, '0'),
      sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };
  const containsBadWord = text => badWords.some(b => text.toLowerCase().includes(b));

  // Comment submit
  const handleCommentSubmit = async e => {
    e.preventDefault();
    const txt = commentInput.trim();
    if (!txt) return;
    if (!user) { toast.error('Đăng nhập để bình luận'); return; }
    if (containsBadWord(txt)) { toast.error('Chứa từ cấm'); return; }

    try {
      await axiosInstance.post('/api/comments', {
        user_id: user.id,
        movie_slug: movieSlug,
        episode_slug: episodeSlug,
        comment: txt,
        time_film: secondsToHHMMSS(currentTime),
        time_in_seconds: currentTime
      });
      setCommentInput('');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  // Report flows
  const openReport = id => {
    setReportCommentId(id);
    setReportDesc('');
    setReportError('');
    setReportSuccess(false);
    setReportOpen(true);
  };
  const closeReport = () => setReportOpen(false);
  const submitReport = async e => {
    e.preventDefault();
    if (!reportDesc.trim()) {
      setReportError('Nhập lý do báo cáo');
      return;
    }
    try {
      await axiosInstance.post('/api/reports/create', {
        id_user: user.id,
        id_type_comment: 3,    // comment
        movie_slug: movieslug,
        movie_name: moviename,
        episode_name: episodecurrently,
        id_comment: reportCommentId,
        despcript: reportDesc,
        navigate: window.location.href,
        status: 0
      });
      setReportSuccess(true);
      toast.success("Gửi báo cáo thành công!")

    } catch (err) {
      console.error(err);
      setReportError('Gửi không thành công');
    }
  };

  // Filter
  const filterComments = () => (
    viewMode === 'time'
      ? comments.filter(c => c.timeInSeconds <= currentTime + 0.5)
      : comments
  );

  return (
    <div className="comments-container" ref={containerRef}>
      <div className="comments-header">
        <h3>Bình luận</h3>
        <div className="view-mode-selector">
          <button className={viewMode === 'all' ? 'active' : ''} onClick={() => setViewMode('all')}>Tất cả</button>
          <button className={viewMode === 'time' ? 'active' : ''} onClick={() => setViewMode('time')}>Theo thời gian</button>
        </div>
      </div>

      <div className="comments-scroll-container">
        <div className="comments-content">
          {filterComments().map((c, i) => (
            <div key={c.id} className="comment-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="comment-header">
                <strong className='me-1'>{c.name}</strong>
                <span> {c.type === "1" ? '(Admin)' : ""}</span>
              </div>
              <p className="comment-text">{c.comment}</p>
              <div className="comment-footer">
                {viewMode === 'time' && <span className="time-stamp">{c.time_film}</span>}
                <span className="time-ago">{moment(c.created_at).fromNow()}</span>
                <button
                  className="btn-report"
                  onClick={() => openReport(c.id)}
                  disabled={c.user_id === user?.id}
                >
                  Báo cáo
                </button>
              </div>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>
      </div>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          placeholder="Viết bình luận..."
          rows="3"
        />
        <button type="submit" disabled={!commentInput.trim()}>Gửi bình luận</button>
      </form>

      {/* Modal báo cáo bình luận */}
      {reportOpen && (
        <div className="report-modal-overlay" onClick={closeReport}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>

            <form onSubmit={submitReport}>
              <h3>Báo cáo bình luận</h3>
              <textarea
                value={reportDesc}
                onChange={e => { setReportDesc(e.target.value); setReportError(''); }}
                rows="4"
                placeholder="Mô tả lý do..."
              />
              {reportError && <p className="error">{reportError}</p>}
              <div className="btns">
                <button type="button" className='cancel-btn' onClick={closeReport}>Hủy</button>
                <button type="submit" className="submit-btn">Gửi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
