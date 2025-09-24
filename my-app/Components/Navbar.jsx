import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStatusChange", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStatusChange", checkLoginStatus);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/services?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // clear input after search
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    window.dispatchEvent(new Event("loginStatusChange"));
    navigate("/");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.classList.contains("menu-toggle")
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const services = ["plumber", "electrician", "beautician", "car service"];
  const filteredServices = services.filter((service) =>
    service.includes(searchQuery.toLowerCase())
  );

  return (
    <nav className={`navbar ${isMenuOpen ? "open" : ""}`}>
      <div className="navbar-logo">
        <img src="./src/assets/LogoM.png" alt="HelpyFier Logo" />
      </div>

      {/* ✅ Added Search Bar */}
      {userRole !== "provider" &&(
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="fa-solid fa-magnifying-glass"></i> Search
            </button>
          </form>
        )}

      {/* Desktop Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {isLoggedIn && userRole === "provider" && (
          <>
            <li className="provider-link1">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="provider-link2">
              <Link to="/add-service">Add Service</Link>
            </li>
          </>
        )}
        {isLoggedIn && userRole === "user" && (
          <li className="user-link">
            <Link to="/my-bookings">My Bookings</Link>
          </li>
        )}
      </ul>

      {/* Desktop Auth Buttons */}
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <button className="navbar-cta" onClick={handleLogout}>
              Logout
            </button>
            <i className="fa-solid fa-bag-shopping"></i>
          </>
        ) : (
          <>
            <Link to="/register">
              <button className="navbar-cta">Register</button>
            </Link>
            <Link to="/login">
              <button className="navbar-cta">Login</button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Auth Menu */}
      <div ref={menuRef} className={`mobile-menu ${isMenuOpen ? "show" : ""}`}>
        {isLoggedIn && userRole === "provider" && (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/add-service">Add Service</Link>
            </li>
          </>
        )}
        {isLoggedIn && userRole === "user" && (
          <li>
            <Link to="/my-bookings">My Bookings</Link>
          </li>
        )}

        {isLoggedIn ? (
          <button className="navbar-cta" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/register">
              <button className="navbar-cta">Register</button>
            </Link>
            <Link to="/login">
              <button className="navbar-cta">Login</button>
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Menu */}
      <div
        className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
        onClick={handleMenuToggle}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Search Dropdown */}
      {searchQuery && (
        <div className="search-results-dropdown">
          {filteredServices.length > 0 ? (
            <ul>
              {filteredServices.map((service, index) => (
                <li
                  key={index}
                  onClick={() => {
                    navigate(`/services?query=${service}`);
                    setSearchQuery("");
                  }}
                >
                  {service}
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
