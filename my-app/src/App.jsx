import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ServicePage from "./Pages/Services";
import "./App.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import AddListings from "./Pages/AddListings";
import OneService from "./Pages/OneService";
import EditService from "./Pages/EditService";
import Dashboard from "./Pages/Dashboard";
import Register from "./Pages/Registration";
import Login from "./Pages/Login";
import ProviderRegistration from "./Pages/ProvideRegistration";
import MyServices from "./Pages/Provider_Myservices";
import BookingPage from "./Pages/BookingPage";
import MyBookings from "./Pages/MyBooking";

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-iecdLp3v1y9A/3A8l+N+K/YQzF1gM2ZlX/4i+N+2A2M+A2N+X/A1O/0w==" crossorigin="anonymous" referrerpolicy="no-referrer" />

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/add-service" element={<AddListings />} />
        <Route path="/services/:id" element={<OneService />} />
        <Route path="/update-service/:id" element={<EditService />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/provider/registration" element={<ProviderRegistration />} />
        <Route path="/provider/myservices" element={<MyServices />} />
        <Route path="/book/:serviceId" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      <Footer />
    </Router>
  );
}

// We need a wrapper component to use the useNavigate hook
const AddListingsWrapper = () => {
  const navigate = useNavigate();
  return <AddListings navigate={navigate} />;
};

export default App;
