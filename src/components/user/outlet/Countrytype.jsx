import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '../../../view/user/Menu';
import './Countrytype.scss';
import axiosInstance from '../../../service/axiosInstance';

const Countrytype = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/movies/allcountry')
      .then(res => {
        setCountries(res.data.countries);
      })
      .catch(err => {
        console.error('Lỗi fetch quốc gia:', err);
      });
  }, []);

  return (
    <div className="country-container">
      <h1>🎬 Thể loại phim theo quốc gia</h1>
      <div className="country-list">
        {countries.map((country, index) => {
          const code = (slugToCountryCode[country.slug] || 'un').toLowerCase();
          return (
            <div className="country-item" key={index}>
              <Link to={`/country/${country.slug}/1`} className="country-link">
                <img
                  src={`https://flagcdn.com/w40/${code}.png`}
                  alt={country.name}
                  className="country-flag"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="country-name">{country.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const slugToCountryCode = {
  'viet-nam': 'VN',
  'trung-quoc': 'CN',
  'thai-lan': 'TH',
  'hong-kong': 'HK',
  'phap': 'FR',
  'duc': 'DE',
  'ha-lan': 'NL',
  'mexico': 'MX',
  'thuy-dien': 'SE',
  'philippines': 'PH',
  'dan-mach': 'DK',
  'thuy-si': 'CH',
  'ukraina': 'UA',
  'han-quoc': 'KR',
  'au-my': 'US',
  'an-do': 'IN',
  'canada': 'CA',
  'tay-ban-nha': 'ES',
  'indonesia': 'ID',
  'ba-lan': 'PL',
  'malaysia': 'MY',
  'bo-dao-nha': 'PT',
  'uae': 'AE',
  'chau-phi': 'ZA',
  'a-rap-xe-ut': 'SA',
  'nhat-ban': 'JP',
  'dai-loan': 'TW',
  'anh': 'GB',
  'quoc-gia-khac': 'UN',
  'tho-nhi-ky': 'TR',
  'nga': 'RU',
  'uc': 'AU',
  'brazil': 'BR',
  'y': 'IT',
  'na-uy': 'NO',
  'namh': 'ZA',
  'kinh-dien': 'UN',
};

export default Countrytype;
