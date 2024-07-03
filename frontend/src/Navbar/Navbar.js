import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink for active link styling
import './Navbar.css';

const Navbar = () => {
  return (
    <div className='nav-bar'>
      <div className='nav-logo'>
        <p>CR</p>
      </div>
      <ul className='nav-menu'>
        <li>
          <NavLink to='/home' style={{ textDecoration: 'none' }} activeClassName='active'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/course' style={{ textDecoration: 'none' }} activeClassName='active'>Course</NavLink>
        </li>
        <li>
          <NavLink to='/best' style={{ textDecoration: 'none' }} activeClassName='active'>Best Courses</NavLink>
        </li>
      </ul>
      <div className='nav-login'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <button>Logout</button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
