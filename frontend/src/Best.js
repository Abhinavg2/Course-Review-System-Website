import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from './Navbar/Navbar';
import axios from "axios";

const Best = () => {
  const [data, setData] = useState([]);
  const [bestCoursesByDomain, setBestCoursesByDomain] = useState([]);
  const navigate = useNavigate();

  const filterBestCoursesByDomain = useCallback(() => {
    const coursesByDomain = data.reduce((acc, course) => {
      if (course.price !== null) {
        if (!acc[course.domain]) {
          acc[course.domain] = [];
        }
        acc[course.domain].push(course);
      }
      return acc;
    }, {});

    const bestCourses = Object.keys(coursesByDomain).map(domain => {
      const courses = coursesByDomain[domain];
      if (courses.length === 0) {
        return null;
      }
      courses.sort((a, b) => a.price - b.price);
      return { domain, course: courses[0] }; // Assuming the best course is the one with the lowest price
    }).filter(courseObj => courseObj !== null);

    setBestCoursesByDomain(bestCourses);
  }, [data]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/allcourse");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    filterBestCoursesByDomain();
  }, [data, filterBestCoursesByDomain]);

  return (
    <div>
      <Navbar />
      <Container>
        <h3>Best Courses by Domain</h3>
        {bestCoursesByDomain.length ? (
          bestCoursesByDomain.map(({ domain, course }) => (
            course ? (
              <div key={domain}>
                <h4>{domain}</h4>
                <Row style={{ marginTop: '20px' }}>
                  <Col xs={12} sm={6} md={4}>
                    <Card style={{ marginBottom: '20px' }}>
                      <Card.Body>
                        <Card.Title>{course.title}</Card.Title>
                        <Card.Text>
                          <strong>Platform:</strong> {course.platform}
                          <br />
                          <strong>Tutor:</strong> {course.tutor}
                          <br />
                          <strong>Hours:</strong> {course.no_of_hours}
                          <br />
                          <strong>Lectures:</strong> {course.no_of_lectures}
                          <br />
                          <strong>Price:</strong> {course.price}
                        </Card.Text>
                        <Button variant="primary" onClick={() => navigate('/allreview', { state: { id: course.id } })}>
                          View Reviews
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            ) : null
          ))
        ) : (
          <h1>No courses available</h1>
        )}
      </Container>
    </div>
  );
};

export default Best;
