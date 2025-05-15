import React, { useEffect, useState } from 'react';
import axios from '../../../../service/axiosInstance';
import './Like.scss';

const Like = () => {
  const [likes, setLikes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLikes();
  }, []);

  useEffect(() => {
    applySortingAndFiltering();
  }, [sortOrder, likes, searchQuery]);

  const fetchLikes = async () => {
    try {
      const res = await axios.get('/api/like/most-liked');
      const all = res.data.data;
      setLikes(all);
      setFiltered(all);
    } catch (err) {
      console.error('Lỗi khi lấy likes:', err);
    }
  };

  const applySortingAndFiltering = () => {
    let sortedData = [...likes];

    if (searchQuery.trim()) {
      sortedData = sortedData.filter((like) =>
        like.movie_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    sortedData.sort((a, b) => {
      const likeCountA = a.like_count;
      const likeCountB = b.like_count;
      return sortOrder === 'asc' ? likeCountA - likeCountB : likeCountB - likeCountA;
    });

    setFiltered(sortedData);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="like-film-wrapper">
      <h2 className="title-like">Danh sách phim được yêu thích nhất</h2>

      <div className="filter-sort">
        <input
          type="text"
          placeholder="Tìm phim..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-film-like"
        />
        <button onClick={toggleSortOrder} className="btn-sort">
          Sắp xếp {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="list-top-like">
        <table className="table-list-top-like">
          <thead>
            <tr>
              <th>Tên phim</th>
              <th className="text-center">Tổng số lượt thích</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((like) => (
                <tr key={like.movie_slug}>
                  <td>{like.movie_name}</td>
                  <td className="text-center">{like.like_count} lượt</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Like;
