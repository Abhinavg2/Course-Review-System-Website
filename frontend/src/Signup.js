import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Valid from './SignValid';
import axios from 'axios';

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    console.log(`Input ${name} changed to: ${value}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
    const validationErrors = Valid(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
    console.log("Validation errors:", validationErrors);
  };

  useEffect(() => {
    if (isSubmitting) {
      console.log("useEffect triggered with isSubmitting:", isSubmitting);
      const noErrors = Object.keys(errors).every((key) => !errors[key]);
      console.log("No errors:", noErrors);
      if (noErrors) {
        axios.post('http://localhost:8081/signup', values)
          .then((res) => {
            console.log("API response:", res);
            navigate('/');
          })
          .catch((err) => {
            console.error("API error:", err);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors, isSubmitting, navigate, values]);

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="name"><strong>Name</strong></label>
            <input
              type="text"
              id="name"
              name='name'
              placeholder='Enter Name'
              value={values.name}
              onChange={handleInput}
              className='form-control rounded-0'
              autoComplete='name'
            />
            {errors.name && <span className='text-danger'>{errors.name}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              id="email"
              name='email'
              placeholder='Enter Email'
              value={values.email}
              onChange={handleInput}
              className='form-control rounded-0'
              autoComplete='email'
            />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              id="password"
              name='password'
              placeholder='Enter Password'
              value={values.password}
              onChange={handleInput}
              className='form-control rounded-0'
              autoComplete='new-password'
            />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100'><strong>Sign up</strong></button>
          <p>You agree to our terms and policies</p>
          <Link to="/" className='btn btn-default border w-100 bg-light'>Login</Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
