import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Course from './Course';
import Allreview from './Allreview';
import Review from './Allreviews';
import Best from './Best';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Logic to handle login
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes */}
        {isLoggedIn && (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/course" element={<Course />} />
            <Route path="/allreview" element={<Allreview />} />
            <Route path="/all-reviews/:id" element={<Review />} />
            <Route path="/best" element={<Best />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
