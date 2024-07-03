import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import Navbar from './Navbar/Navbar';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

const Home = () => {
  const [topRatedCourses, setTopRatedCourses] = useState([]);

  useEffect(() => {
    fetchTopRatedCourses();
  }, []);

  const fetchTopRatedCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8081/top-rated-courses');
      const filteredCourses = response.data.filter(course => course.average_rating > 2);
      console.log('Filtered Courses:', filteredCourses);
      setTopRatedCourses(filteredCourses);
    } catch (error) {
      console.error('Error fetching top-rated courses:', error);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="container">
      <Navbar />
      <Hero />
      <div className="content">
        <div className="top-rated-courses">
          <h2>Top Rated Courses</h2>
          {topRatedCourses.length > 0 ? (
            <Slider {...settings}>
              {topRatedCourses.map(course => (
                <div key={course.id}>
                  <Link to={`/all-reviews/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="course-box">
                      <h3>{course.title}</h3>
                      <p>Platform: {course.platform}</p>
                      <p>Tutor: {course.tutor}</p>
                      <p>Average Rating: {course.average_rating}</p>
                      <p>No. of Hours: {course.no_of_hours}</p>
                      <p>No. of Lectures: {course.no_of_lectures}</p>
                      <p>Price: {course.price ? course.price : ' - '}</p>
                      <p>Domain: {course.domain ? course.domain : ' - '}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          ) : (
            <p>No top-rated courses found.</p>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>&copy; {currentYear} CR</p>
      </footer>
    </div>
  );
};

export default Home;
