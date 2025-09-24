import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';

function App() {
  // New: Image carousel state
  const images = [
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/t_high_res_category/images/growth/luminosity/1695976153902-bcb609.jpeg",
    "https://www.myfng.tech/blogs/uploads/file_689079463eeba3.97377767.webp",
    "https://indietalent.2coms.com/wp-content/uploads/2024/12/Blog-Post-thumbnail-21.jpg",
    "https://t3.ftcdn.net/jpg/14/38/65/84/360_F_1438658411_v0NfdJRLJifcVSHQnNS7DTSB2fnGJwlK.jpg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate(); 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Navigate to login page
  const goToLogin = () => {
    navigate("/login"); // Replace "/login" with your login route
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span className="highlight">Haepyfier</span>
          </h1>
          <p>Your one-stop solution for trusted home services</p>
          <button className="cta-btn" onClick={goToLogin}>Book a Service</button>
        </div>

        <div className="hero-image-slider">
          <div
            className="hero-slider-inner"
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
            }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index + 1}`}
                className="hero-img1"
              />
            ))}
          </div>
        </div>
      </section>



      {/* Services Section */}
      <section className="services">
        <h2>Our Popular Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <img
              src="https://img.icons8.com/ios-filled/100/cleaning-a-surface.png"
              alt="Cleaning"
            />
            <h3>Home Cleaning</h3>
            <p>Professional cleaning for a sparkling home.</p>
          </div>
          <div className="service-card">
            <img
              src="https://img.icons8.com/ios-filled/100/hair-dryer.png"
              alt="Salon"
            />
            <h3>Salon at Home</h3>
            <p>Beauty and grooming services at your doorstep.</p>
          </div>
          <div className="service-card">
            <img
              src="https://www.freeiconspng.com/thumbs/repair-workshop-icon-png/hardware-icon-9.png"
              alt="Repairs"
            />
            <h3>Repairs</h3>
            <p>Quick fixes for all your household needs.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <h2>Why Choose Haepyfier?</h2>
        <div className="features">
          <div className="feature">
            <img
              src="https://img.icons8.com/ios-filled/100/clock.png"
              alt="24/7 Support"
            />
            <h3>24/7 Support</h3>
            <p>We’re always here to help you, day or night.</p>
          </div>
          <div className="feature">
            <img
              src="https://static.thenounproject.com/png/premium-check-badge-icon-1647007-512.png"
              alt="Verified"
            />
            <h3>Trusted Professionals</h3>
            <p>Background-verified and experienced experts.</p>
          </div>
          <div className="feature">
            <img
              src="https://img.icons8.com/ios-filled/100/low-price.png"
              alt="Affordable"
            />
            <h3>Affordable Pricing</h3>
            <p>Premium services at pocket-friendly rates.</p>
          </div>
          <div className="feature">
            <img
              src="https://img.icons8.com/ios-filled/100/lock--v1.png"
              alt="Secure Payments"
            />
            <h3>Secure Payments</h3>
            <p>Safe, seamless and cashless transactions.</p>
          </div>
          <div className="feature">
            <img
              src="https://img.icons8.com/ios-filled/100/delivery.png"
              alt="Fast Service"
            />
            <h3>Fast & Reliable</h3>
            <p>Quick response and on-time service guaranteed.</p>
          </div>
          <div className="feature">
            <img
              src="https://img.icons8.com/ios-filled/100/happy.png"
              alt="Customer Satisfaction"
            />
            <h3>Customer Satisfaction</h3>
            <p>Our top priority is your happiness and trust.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat">
          <h2>10K+</h2>
          <p>Happy Customers</p>
        </div>
        <div className="stat">
          <h2>500+</h2>
          <p>Trusted Professionals</p>
        </div>
        <div className="stat">
          <h2>50+</h2>
          <p>Services Available</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2> <br></br>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>
              “Haepyfier made my life easier! The cleaners were professional and
              polite.”
            </p>
            <h4>- Priya, Bangalore</h4>
          </div>
          <div className="testimonial-card">
            <p>
              “The salon at home service is amazing. I felt like I was at a
              luxury spa.”
            </p>
            <h4>- Rohan, Mumbai</h4>
          </div>
          <div className="testimonial-card">
            <p>“Quick repairs and affordable prices. Highly recommended!”</p>
            <h4>- Anjali, Delhi</h4>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to experience hassle-free services?</h2>
        <button className="cta-btn" onClick={goToLogin}>Get Started</button>
      </section>
    </div>
  );
}

export default App;
