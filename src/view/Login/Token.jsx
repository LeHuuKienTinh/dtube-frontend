// Token.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Token.scss';

const Token = () => {
  const [inputToken, setInputToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputToken) return;
    navigate(`/token/${inputToken}`);
  };

  return (
    <div className="token-wrapper">
      <form onSubmit={handleSubmit} className="token-form">
        <h2 className="token-title">Nhập Mã Token</h2>

        <input
          type="text"
          placeholder="Nhập token"
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
          className="token-input"
          required
        />

        <button type="submit" className="token-button">
          Kiểm tra
        </button>
      </form>
    </div>
  );
};

export default Token;
