import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import './Hero.css'; // Import the CSS file for styling

const Hero = () => {
  return (
    <div>
      <Carousel data-bs-theme="dark">
        <Carousel.Item>
          <Link to="/course">
            <img
              className="d-block w-100 carousel-image"
              src="https://wallpapers.com/images/hd/fine-line-on-light-green-plain-l7xaq02nj15v4hcz.jpg"
              alt="First slide"
            />
          </Link>
          <Carousel.Caption>
            <h5>Want to upgrade your skills?</h5>
            <p>Click here to view all the courses with rating and reviews and make the best choice.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Link to="/best">
            <img
              className="d-block w-100 carousel-image"
              src="https://img.freepik.com/free-photo/orange-background_23-2147674307.jpg"
              alt="Second slide"
            />
          </Link>
          <Carousel.Caption>
            <h5>Want affordable courses which adds value to you?</h5>
            <p>Click here and find best courses on various domains.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Hero;
