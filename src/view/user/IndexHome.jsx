import React, { useState } from "react";
import MovieList from "../../components/user/home/MovieList";
import './IndexHome.scss';
import { Link } from "react-router-dom";
import Banner from "../../components/user/home/Banner"
import HistoryCard from "../../components/user/home/HistoryCard"
import { IoIosArrowForward } from "react-icons/io";
import { TbMinusVertical } from "react-icons/tb";

const IndexHome = () => {
    const [selectedCategory, setSelectedCategory] = useState(null); // State để lưu category hiện tại

    const handleCategoryClick = (category) => {
        setSelectedCategory(category); // Cập nhật thể loại khi click vào h2
    };

    return (
        <div className="indexhome-wrapper"> 
            <Banner />

            <Link to="/new/1">
                <h2 className="title-type"><TbMinusVertical />Phổ Biến Trên DTube<IoIosArrowForward /></h2>
            </Link>
            <MovieList typeSlug="/new" layout="horizontal" apiUrl="/api/movies/latest/1" />

            <Link to="/type/hanh-dong/1">
                <h2 className="title-type"><TbMinusVertical />Hành Động<IoIosArrowForward /></h2>
            </Link>
            <MovieList typeSlug="type/hanh-dong" apiUrl="/api/movies/category/hanh-dong/1" layout="horizontal" />

            <Link to="/type/tinh-cam/1">
                <h2 className="title-type"><TbMinusVertical />Tình Cảm<IoIosArrowForward /></h2>
            </Link>
            <MovieList typeSlug="type/tinh-cam" apiUrl="/api/movies/category/tinh-cam/1" layout="horizontal" />

            <Link to="/type/kinh-di/1">
                <h2 className="title-type"><TbMinusVertical />Kinh Dị<IoIosArrowForward /></h2>
            </Link>
            <MovieList typeSlug="type/kinh-di" apiUrl="/api/movies/category/kinh-di/1" layout="horizontal" />

            <HistoryCard viewType="card" />
        </div>
    );
};

export default IndexHome;
