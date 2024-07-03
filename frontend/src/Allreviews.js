import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';

const AllReview = () => {
  const location = useLocation();
  const { id } = useParams(); // Get the id parameter from the URL
  const [course, setCourse] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    reviewer_name: '',
    rating: '',
    review_text: ''
  });
  const [error, setError] = useState(null);

  // Fetch course details by ID
  const fetchCourseDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8081/allcourse/${id}`);
      setCourse(response.data);
    } catch (error) {
      setError(error.message);
    }
  }, [id]);

  // Fetch reviews by course ID
  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8081/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      setError(error.message);
    }
  }, [id]);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchCourseDetails();
    fetchReviews();
  }, [fetchCourseDetails, fetchReviews]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission to add a review
  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8081/add-review/${id}`, newReview);
      console.log('Review added successfully:', response.data);
      // Clear form fields after successful submission
      setNewReview({
        reviewer_name: '',
        rating: '',
        review_text: ''
      });
      // Fetch updated reviews after adding a new review
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      setError(error.message);
    }
  };

  // Display error message if fetching data fails
  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div>
      <h2>Course Details</h2>
      <p>Title: {course.title}</p>
      <p>Platform: {course.platform}</p>
      <p>Tutor: {course.tutor}</p>
      <p>Number of Lectures: {course.no_of_lectures}</p>
      <p>Number of Hours: {course.no_of_hours}</p>

      <h2>Reviews</h2>
      <ul>
        {reviews.map(review => (
          <li key={review.review_id}>
            <p>Reviewer: {review.reviewer_name}</p>
            <p>Rating: {review.rating}</p>
            <p>Review: {review.review_text}</p>
          </li>
        ))}
      </ul>

      <h2>Add a Review</h2>
      <form onSubmit={handleAddReview}>
        <div>
          <label>Reviewer Name:</label>
          <input
            type="text"
            name="reviewer_name"
            value={newReview.reviewer_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={newReview.rating}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Review:</label>
          <textarea
            name="review_text"
            value={newReview.review_text}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default AllReview;
