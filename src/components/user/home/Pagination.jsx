import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pagination.scss';

const Pagination = ({ currentPage, kind, totalPages, onPageChange }) => {
  const [startPage, setStartPage] = useState(1);
  const pageBlockSize = 4;
  const navigate = useNavigate();

  // Ép kiểu currentPage sang số nguyên
  const validPage = parseInt(currentPage, 10) || 1;

  // Cập nhật startPage mỗi khi validPage thay đổi
  useEffect(() => {
    const block = Math.floor((validPage - 1) / pageBlockSize) * pageBlockSize + 1;
    setStartPage(block);
  }, [validPage]);

  const next = () => {
    setStartPage(startPage + pageBlockSize);
  };

  const prev = () => {
    const prevBlock = startPage - pageBlockSize;
    if (prevBlock >= 1) {
      setStartPage(prevBlock);
    }
  };

  const first = () => setStartPage(1);

  const pageNumbers = [];
  for (let i = 0; i < pageBlockSize; i++) {
    if (startPage + i <= totalPages) {  // Kiểm tra giới hạn của totalPages
      pageNumbers.push(startPage + i);
    }
  }

  const handlePageClick = (page) => {
    onPageChange(page); // Truyền lại page mới lên ListFilm
  };

  return (
    <div className="pagination">
      <button onClick={first} disabled={validPage === 1}>
        {'<<'}
      </button>
      <button onClick={prev} disabled={validPage === 1}>
        {'<'}
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={page === validPage ? 'active' : ''}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      <button
        onClick={next}
        disabled={startPage + pageBlockSize > totalPages}
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;
