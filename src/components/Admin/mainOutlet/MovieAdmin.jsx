import React from 'react'
import './MovieAdmin.scss'
import Menumovie from '../movieManage/Menumovie'
import { Outlet } from 'react-router-dom'
const MovieAdmin = () => {
  return (
    <div className='movie-wrapper'>
      <h2 className='title-movie'>Quản lý Phim</h2>
      <Menumovie />
      <Outlet />
    </div>
  )
}

export default MovieAdmin
