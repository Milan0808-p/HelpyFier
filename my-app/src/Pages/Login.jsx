import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// This CSS file will also be used by your Register page
// import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // FIX: Correctly access the role, id and token
      const userRole = response.data.user.role;
      const userId = response.data.user._id; // <-- Make sure backend sends "_id" or "id"
      const userToken = response.data.token;

      // Store token, role, and providerId in localStorage
      localStorage.setItem("token", userToken);
      localStorage.setItem("role", userRole);
      localStorage.setItem("providerId", userId); // <-- this is the FIX

      // Trigger Navbar update
      window.dispatchEvent(new Event("loginStatusChange"));

      console.log("Login successful!", response.data);

      // Login.jsx (inside handleLogin after successful login)
const userData = {
  id: response.data.user.id,
  name: response.data.user.name,
  email: response.data.user.email,
  role: response.data.user.role,
};

// Save the full user object
localStorage.setItem("user", JSON.stringify(userData));

// Save token separately if backend sends it
if (response.data.token) {
  localStorage.setItem("token", response.data.token);
}

      // Redirect the user based on their role
      if (userRole === "provider") {
        navigate("/dashboard");
      } else {
        navigate("/services");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
