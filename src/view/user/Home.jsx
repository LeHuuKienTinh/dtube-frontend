import React from 'react';
import './Home.scss'
import Menu from './Menu';
import FooterHomePage from '../../components/home/HomePage/FooterHomePage/FooterHomePage';
import { Outlet } from 'react-router-dom';
const Home = () => {


  return (
    <div className='container' >
      <div className='container-home'>
        <Menu />
        <div className='outlet'>
          <Outlet></Outlet>
        </div>
        <FooterHomePage />
      </div>
    </div>
  );
};

export default Home;
