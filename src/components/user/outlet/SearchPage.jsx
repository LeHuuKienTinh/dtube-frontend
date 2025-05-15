import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchPage.scss';
import axiosInstance from '../../../service/axiosInstance';
import TypeFilm from '../../../ultis/user/ListTypeFilm';
import Pagination from '../home/Pagination';

let typingTimer;

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [films, setFilms] = useState([]);
  const [domainCdn, setDomainCdn] = useState('');
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [history, setHistory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setHistory(saved);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get('keyword') || '';
    const pageFromUrl = parseInt(params.get('page') || '1', 10);

    if (keyword.trim()) {
      setSearchQuery(keyword);
      performSearch(keyword, true, pageFromUrl);
    }
  }, [location.search]);

  const saveToHistory = (keyword) => {
    const old = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newHistory = [keyword, ...old.filter(k => k !== keyword)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const deleteKeyword = (keyword) => {
    const updated = history.filter(k => k !== keyword);
    setHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const performSearch = async (keyword, shouldSave = false, page = 1) => {
    if (!keyword.trim()) return;
    setLoading(true);
    setNoResults(false);
    try {
      const res = await axiosInstance.get('/api/movies/search', {
        params: {
          keyword: keyword.trim(),
          page,
          limit: 12 // số phim mỗi trang
        }
      });
      const { items = [], domainCdnImage, totalPages } = res.data; // ✅ destructure đúng
      setDomainCdn(domainCdnImage);
      console.log("timkiem", res.data.totalPage)
      const mapped = items.map(m => ({
        id: m._id,
        name: m.name,
        slug: m.slug,
        poster_url: `${domainCdnImage}/${m.poster_url}`
      }));
      setFilms(mapped);
      setNoResults(mapped.length === 0);
      setCurrentPage(page);
      setTotalPages(totalPages);
      if (shouldSave) saveToHistory(keyword.trim());
    } catch (err) {
      console.error(err);
      setFilms([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(typingTimer);
    if (searchQuery.trim()) {
      typingTimer = setTimeout(() => {
        navigate(`/search?keyword=${encodeURIComponent(searchQuery)}&page=1`);
      }, 500);
    } else {
      setFilms([]);
    }
    return () => clearTimeout(typingTimer);
  }, [searchQuery]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}&page=1`);
    }
  };

  const handlePageChange = (page) => {
    navigate(`/search?keyword=${encodeURIComponent(searchQuery)}&page=${page}`);
  };

  return (
    <div className="search-page">
      <div className="search-container">
        {history.length > 0 && (
          <div className="search-history">
            <h3>Lịch sử tìm kiếm</h3>
            <ul>
              {history.map((item, i) => (
                <li key={i}>
                  <span onClick={() => setSearchQuery(item)}>{item}</span>
                  <button onClick={() => deleteKeyword(item)}>❌</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {noResults && <p className="no-result">Không có kết quả.</p>}

        <TypeFilm
          data={films}
          layout="horizontal"
          onLoadMore={() => { }}
        />

        {films.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
