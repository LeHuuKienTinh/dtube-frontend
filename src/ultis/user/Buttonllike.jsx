import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import axiosInstance from '../../service/axiosInstance';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import các icon
import './Buttonllike.scss'; // Import CSS cho button

const Buttonllike = ({ slug, name }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(null); // true/false
  const [likeId, setLikeId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái like khi render
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user?.id || !slug) return;

      try {
        const response = await axiosInstance.get(`/api/like/check/${user.id}/${slug}`);
        if (response.data) {
          setLiked(response.data.liked);
          setLikeId(response.data.likeId); // Để xoá sau này
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra like:", error);
        setLiked(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLikeStatus();
  }, [user, slug]);

  // Thêm yêu thích
  const handleAddLike = async (e) => {
    e.stopPropagation();
    if (loading) return; // Không cho phép nhấn nếu đang tải
    setLoading(true);

    try {
      const payload = {
        user_id: user.id,
        movie_slug: slug,
        movie_name: name
      };

      const response = await axiosInstance.post('/api/like', payload);

      if (response.data?.data?.likeId) {
        setLiked(true);
        setLikeId(response.data.data.likeId);
      }
    } catch (error) {
      console.error('Không thể thêm yêu thích', error);
      alert('Không thể thêm yêu thích');
    } finally {
      setLoading(false);
    }
  };

  // Hủy yêu thích
  const handleRemoveLike = async (e) => {
    e.stopPropagation();
    if (loading || !likeId) return; // Không cho phép nhấn nếu đang tải hoặc không có likeId

    setLoading(true);

    try {
      const response = await axiosInstance.delete(`/api/like/${likeId}`);
      if (response.data.success) {
        setLiked(false);
        setLikeId(null);
      }
    } catch (error) {
      console.error('Không thể hủy yêu thích', error);
      alert('Không thể hủy yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const renderButton = () => {
    if (loading) return <button className="like-btned" disabled>Đang kiểm tra...</button>;

    return liked ? (
      <button className="like-btn" onClick={handleRemoveLike} disabled={loading}>
        <FaHeart /> Hủy thích
      </button>
    ) : (
      <button className="like-btned" onClick={handleAddLike} disabled={loading}>
        <FaRegHeart /> Yêu thích
      </button>
    );
  };

  return <div>{renderButton()}</div>;
};

export default Buttonllike;
