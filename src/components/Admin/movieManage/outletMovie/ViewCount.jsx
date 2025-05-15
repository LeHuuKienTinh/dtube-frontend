

import React, { useEffect, useState } from 'react';
import axios from '../../../../service/axiosInstance'; // dùng instance có JWT nếu cần
import './ViewCount.scss'
const ViewCount = () => {
  const [views, setViews] = useState([]);
  const [filteredViews, setFilteredViews] = useState([]);
  const [movieFilter, setMovieFilter] = useState('');
  const [episodeFilter, setEpisodeFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const fetchViews = async () => {
      const res = await axios.get('/api/view');
      setViews(res.data);
      setFilteredViews(res.data);
      console.log("view", res.data)
    };
    fetchViews();
  }, []);
  useEffect(() => {
    handleFilter();
  }, [movieFilter, episodeFilter]);
  const handleFilter = () => {
    let filtered = views;

    if (movieFilter) {
      filtered = filtered.filter(v =>
        v.movie_name?.toLowerCase().includes(movieFilter.toLowerCase())
      );
    }

    if (episodeFilter) {
      filtered = filtered.filter(v =>
        v.episode_number?.toString().toLowerCase().includes(episodeFilter.toLowerCase())
      );
    }

    setFilteredViews(filtered);
  };

  const handleSort = () => {
    const sorted = [...filteredViews].sort((a, b) => {
      return sortAsc
        ? new Date(a.count) - new Date(b.count)
        : new Date(b.count) - new Date(a.count);
    });
    setFilteredViews(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="view-count-wrapper">
      <h2 className="title-view-count">Danh sách lượt xem phim</h2>

      <div className="filter-film">
        <input
          type="text"
          placeholder="Lọc theo phim"
          value={movieFilter}
          onChange={e => setMovieFilter(e.target.value)}
          className="input-film"
        />
        <input
          type="text"
          placeholder="Lọc theo tập"
          value={episodeFilter}
          onChange={e => setEpisodeFilter(e.target.value)}
          className="input-film"
        />
        <button onClick={handleFilter} className="btn-filter">
          Lọc
        </button>
        <button onClick={handleSort} className="btn-sort">
          Sắp xếp {sortAsc ? '↓' : '↑'}
        </button>
      </div>

      <table className="table-view">
        <thead>
          <tr>
            <th>Tên phim</th>
            <th td className='text-center'>Tập</th>
            <th td className='text-center'>Lượt xem</th>
          </tr>
        </thead>
        <tbody>
          {filteredViews.map((view, index) => (
            <tr key={index} className="text-center">
              <td >{view.movie_name}</td>
              <td td className='text-center' >{view.episode_number}</td>
              <td className='text-center'>{view.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewCount
