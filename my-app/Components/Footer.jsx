import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  // Check if a 'token' or 'user' item exists in localStorage.
  // The `!!` operator converts the result (a string or null) to a boolean (true or false).
  const isLoggedIn = !!localStorage.getItem('token'); 

  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} HelpyFier. All rights reserved.</div>
      <div className="footer-links">
        <a href="#">Privacy Policy</a>
        <span>|</span>
        <a href="#">Terms of Service</a>
        
        {/* ✅ Conditionally render the link */}
        {/* If the user is NOT logged in, render the Link component. */}
        {!isLoggedIn && (
          <>
            <span>|</span>
            <Link to="/provider/registration">Provider Registration</Link>
          </>
        )}

      </div>
    </footer>
  );
}

export default Footer;