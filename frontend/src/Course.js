import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from './Navbar/Navbar';
import axios from "axios";

const Course = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    platform: "",
    tutor: "",
    no_of_hours: "",
    no_of_lectures: "",
    price: "",
    domain: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const filterData = useCallback(() => {
    const filteredCourses = data.filter(course =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredCourses);
  }, [data, searchTerm]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/allcourse");
      setData(response.data);
      filterData(response.data); // Ensure the initial fetch also sets filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [filterData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    filterData();
  }, [searchTerm, data, filterData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    
    // Validate the input
    if (!newCourse.title || !newCourse.platform || !newCourse.tutor || !newCourse.no_of_hours || !newCourse.no_of_lectures || !newCourse.price || !newCourse.domain) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/addcourse", newCourse);
      const updatedData = [...data, response.data];
      setData(updatedData);
      filterData(updatedData); // Update filtered data with the new course included
      setNewCourse({
        title: "",
        platform: "",
        tutor: "",
        no_of_hours: "",
        no_of_lectures: "",
        price: "",
        domain: ""
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Course already exists");
      } else {
        console.error("Error adding course:", error);
      }
    }
  };

  const handleAddReviewForExistingCourse = (courseId) => {
    navigate('/allreview', { state: { id: courseId } });
  };

  return (
    <div>
      <Navbar />
      <Container>
        <Card>
          <Card.Header>
            <h5>Add a Course</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleAddCourse}>
              <Row>
                <Col>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter course title"
                      name="title"
                      value={newCourse.title}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formPlatform">
                    <Form.Label>Platform</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter course platform"
                      name="platform"
                      value={newCourse.platform}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formTutor">
                    <Form.Label>Tutor</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter course tutor"
                      name="tutor"
                      value={newCourse.tutor}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formHours">
                    <Form.Label>Hours</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter number of hours"
                      name="no_of_hours"
                      value={newCourse.no_of_hours}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formLectures">
                    <Form.Label>Lectures</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter number of lectures"
                      name="no_of_lectures"
                      value={newCourse.no_of_lectures}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter course price"
                      name="price"
                      value={newCourse.price}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formDomain">
                    <Form.Label>Domain</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter course domain"
                      name="domain"
                      value={newCourse.domain}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                Add Course
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <Form style={{ marginTop: '20px' }}>
          <Form.Group controlId="formSearch">
            <Form.Label>Search by Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter course title to search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Form>

        <Row style={{ marginTop: '20px' }}>
          {filteredData.length ? (
            filteredData.map((course) => (
              <Col key={course.id} xs={12} sm={6} md={4}>
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
                      <br />
                      <strong>Domain:</strong> {course.domain}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleAddReviewForExistingCourse(course.id)}>
                      Add Review
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <h1>No courses</h1>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Course;
