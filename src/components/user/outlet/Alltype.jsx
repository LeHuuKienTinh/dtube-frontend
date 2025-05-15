import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Menu from '../../../view/user/Menu'
import './Alltype.scss'
import axiosInstance from '../../../service/axiosInstance'

const Alltype = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/api/movies/allcategory/')
        setCategories(res.data.categories)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thể loại:', error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="alltype-container">
      <h1>Tất Cả Thể Loại Phim</h1>
      <div className="category-list">
        {categories.map((cat, index) => (
          <Link to={`/type/${cat.slug}/1`} key={index} className="category-button">
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Alltype
