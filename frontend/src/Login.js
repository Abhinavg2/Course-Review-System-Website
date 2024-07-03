import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Valid from './LoginValid';
import axios from 'axios';

function Login({ onLogin }) {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Valid(values);
        setErrors(validationErrors);

        // Check if there are no validation errors and email/password are not empty
        if (validationErrors.email === "" && validationErrors.password === "") {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data === "success") {
                        onLogin({ email: values.email });  // Pass the user email to the parent component
                        navigate('/home');
                    } else {
                        alert("No record found."); // Notify user if login failed
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder='Enter Email'
                            name='email'
                            value={values.email}
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder='Enter Password'
                            name='password'
                            value={values.password}
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100'><strong>Log in</strong></button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light'>Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
