const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection for signup database
const dbSignup = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'signup'
});

dbSignup.connect((err) => {
  if (err) {
    console.error('Error connecting to the signup database:', err);
  } else {
    console.log('Connected to the MySQL signup database.');
  }
});

// Endpoint to handle user signup
app.post('/signup', (req, res) => {
  const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password
  ];
  dbSignup.query(sql, values, (err, data) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json({ message: 'User registered successfully', data });
  });
});

// Endpoint to handle user login
app.post('/login', (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  dbSignup.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (data.length > 0) {
      return res.json("success");
    } else {
      return res.json("fail");
    }
  });
});

// MySQL connection for allcourse database
const dbCourses = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'allcourse'
});

dbCourses.connect((err) => {
  if (err) {
    console.error('Error connecting to the courses database:', err);
  } else {
    console.log('Connected to the MySQL courses database.');
  }
});

// Endpoint to fetch all courses
app.get('/allcourse', (req, res) => {
  const sql = 'SELECT * FROM course_details';
  dbCourses.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(result); // Send data as JSON response
  });
});

// Endpoint to fetch course details by ID
app.get('/allcourse/:id', (req, res) => {
  const courseId = req.params.id;
  const sql = 'SELECT * FROM course_details WHERE id = ?';
  dbCourses.query(sql, [courseId], (err, result) => {
    if (err) {
      console.error('Error fetching course details:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.json(result[0]); // Send course details as JSON response
  });
});

// Endpoint to add a new course
app.post('/addcourse', (req, res) => {
  const { title, platform, tutor, no_of_hours, no_of_lectures, price, domain } = req.body;

  // Validate the input
  if (!title || !platform || !tutor || !no_of_hours || !no_of_lectures || !price || !domain) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if the course already exists
  const checkSql = `SELECT * FROM course_details WHERE title = ? AND platform = ? AND tutor = ? AND no_of_hours = ? AND no_of_lectures = ? AND price = ? AND domain = ?`;
  const checkValues = [title, platform, tutor, no_of_hours, no_of_lectures, price, domain];

  dbCourses.query(checkSql, checkValues, (err, result) => {
    if (err) {
      console.error('Error checking course data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.length > 0) {
      return res.status(409).json({ error: 'Course already exists' });
    }

    // Insert the new course
    const sql = "INSERT INTO course_details (title, platform, tutor, no_of_hours, no_of_lectures, price, domain) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [title, platform, tutor, no_of_hours, no_of_lectures, price, domain];

    dbCourses.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error inserting course data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.status(201).json({ message: 'Course added successfully', data });
    });
  });
});

// Endpoint to fetch reviews by course ID
app.get('/reviews/:id', (req, res) => {
  const courseId = req.params.id;
  const sql = 'SELECT * FROM reviews WHERE course_id = ?';
  dbCourses.query(sql, [courseId], (err, result) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(result); // Send reviews as JSON response
  });
});

// Endpoint to add a review
app.post('/add-review/:id', (req, res) => {
  const courseId = req.params.id;
  const { reviewer_name, rating, review_text } = req.body;

  // Validate the input
  if (!reviewer_name || !rating || !review_text) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate the courseId
  if (!courseId || isNaN(courseId)) {
    return res.status(400).json({ error: 'Invalid course ID' });
  }

  const sql = "INSERT INTO reviews (course_id, reviewer_name, rating, review_text) VALUES (?, ?, ?, ?)";
  const values = [courseId, reviewer_name, rating, review_text];

  dbCourses.query(sql, values, (err, data) => {
    if (err) {
      console.error('Error inserting review:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(201).json({ message: 'Review added successfully', data });
  });
});

// Endpoint to fetch top-rated courses
app.get('/top-rated-courses', (req, res) => {
  const sql = `
    SELECT 
        cd.id,
        cd.title,
        cd.platform,
        cd.tutor,
        cd.no_of_hours,
        cd.no_of_lectures,
        cd.price,
        AVG(r.rating) AS average_rating
    FROM 
        course_details cd
    LEFT JOIN 
        reviews r ON cd.id = r.course_id
    GROUP BY 
        cd.id, cd.title, cd.platform, cd.tutor, cd.no_of_hours, cd.no_of_lectures, cd.price
    ORDER BY 
        average_rating DESC;
  `;
  
  dbCourses.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching top-rated courses:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(result); // Send top-rated courses as JSON response
  });
});

// Endpoint to fetch most affordable courses
app.get('/most-affordable-courses', (req, res) => {
  const sql = `
    SELECT 
        id,
        title,
        platform,
        tutor,
        no_of_hours,
        no_of_lectures,
        price
    FROM 
        course_details
    ORDER BY 
        price ASC
    LIMIT 5;
  `;
  
  dbCourses.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching most affordable courses:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(result); // Send most affordable courses as JSON response
  });
});

app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
