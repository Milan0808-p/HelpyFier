import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const providerId = storedUser ? storedUser.id : null;

  useEffect(() => {
    if (!providerId) {
      setError("You must be a provider to view this dashboard.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const url = `http://localhost:5000/api/provider/dashboard/${providerId}`;
        const response = await axios.get(url);

        setProviderData({
          providerName: response.data.providerName || "Provider",
          totalRevenue: response.data.totalRevenue || 0,
          bookings: response.data.bookings || [],
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch dashboard data. Please check the backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [providerId]);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!providerData) return <div className="not-found">No provider data found.</div>;

  const handleAcceptBooking = async (bookingId) => {
    try {
      const url = `http://localhost:5000/api/bookings/${bookingId}/accept`;
      await axios.put(url, { status: "confirmed" });

      setProviderData((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b._id === bookingId ? { ...b, status: "confirmed" } : b
        ),
      }));
    } catch (err) {
      console.error("Error accepting booking:", err.response?.data || err.message);
      alert("Failed to accept booking. Try again.");
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      const url = `http://localhost:5000/api/bookings/${bookingId}/reject`;
      await axios.put(url, { status: "cancelled" });

      setProviderData((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        ),
      }));
    } catch (err) {
      console.error("Error rejecting booking:", err.response?.data || err.message);
      alert("Failed to reject booking. Try again.");
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const url = `http://localhost:5000/api/bookings/${bookingId}/complete`;
      const response = await axios.put(url, { status: "completed" });

      setProviderData((prev) => ({
        ...prev,
        totalRevenue: response.data.totalRevenue,
        bookings: prev.bookings.map((b) =>
          b._id === bookingId ? { ...b, status: "completed" } : b
        ),
      }));
    } catch (err) {
      console.error("Error completing booking:", err.response?.data || err.message);
      alert("Failed to complete booking. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome, {providerData.providerName}!</h1>
        <p>Your dashboard at a glance.</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Total Revenue</h2>
          <p>₹{providerData.totalRevenue}</p>
        </div>
        <div className="stat-card">
          <h2>Total Bookings</h2>
          <p>{providerData.bookings.length}</p>
        </div>
      </div>

      {/* Appointments Sections */}
      <div className="dashboard-appointments">
        <h2>Bookings Overview</h2>

        <div className="appointments-sections">

          {/* Pending Bookings */}
          <div className="appointments-section pending-section">
            <h3>Pending Bookings</h3>
            <div className="appointments-list">
              {providerData.bookings
                .filter(b => b.status === "pending")
                .map((booking, index) => (
                  <div key={index} className="appointment-card">
                    <h3>{booking.serviceId?.name || "Service"}</h3>
                    <p>Client: {booking.userId?.name}</p>
                    <p>Email: {booking.userId?.email}</p>
                    <p>Date: {booking.serviceDate}</p>
                    <p>Time: {booking.serviceTime}</p>
                    <p className={`appointment-status status-${booking.status}`}>
                      {booking.status}
                    </p>
                    <div className="action-buttons">
                      <button className="accept-btn" onClick={() => handleAcceptBooking(booking._id)}>Accept</button>
                      <button className="reject-btn" onClick={() => handleRejectBooking(booking._id)}>Reject</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Confirmed Bookings */}
          <div className="appointments-section confirmed-section">
            <h3>Confirmed Bookings</h3>
            <div className="appointments-list">
              {providerData.bookings
                .filter(b => b.status === "confirmed")
                .map((booking, index) => (
                  <div key={index} className="appointment-card">
                    <h3>{booking.serviceId?.name || "Service"}</h3>
                    <p>Client: {booking.userId?.name}</p>
                    <p>Email: {booking.userId?.email}</p>
                    <p>Date: {booking.serviceDate}</p>
                    <p>Time: {booking.serviceTime}</p>
                    <p className={`appointment-status status-${booking.status}`}>
                      {booking.status}
                    </p>
                    <button className="done-btn" onClick={() => handleCompleteBooking(booking._id)}>Done</button>
                  </div>
                ))}
            </div>
          </div>

          {/* Completed Bookings */}
          <div className="appointments-section completed-section">
            <h3>Completed Bookings</h3>
            <div className="appointments-list">
              {providerData.bookings
                .filter(b => b.status === "completed")
                .map((booking, index) => (
                  <div key={index} className="appointment-card">
                    <h3>{booking.serviceId?.name || "Service"}</h3>
                    <p>Client: {booking.userId?.name}</p>
                    <p>Email: {booking.userId?.email}</p>
                    <p>Date: {booking.serviceDate}</p>
                    <p>Time: {booking.serviceTime}</p>
                    <p className={`appointment-status status-${booking.status}`}>
                      {booking.status}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Cancelled Bookings */}
          <div className="appointments-section cancelled-section">
            <h3>Cancelled Bookings</h3>
            <div className="appointments-list">
              {providerData.bookings
                .filter(b => b.status === "cancelled")
                .map((booking, index) => (
                  <div key={index} className="appointment-card">
                    <h3>{booking.serviceId?.name || "Service"}</h3>
                    <p>Client: {booking.userId?.name}</p>
                    <p>Email: {booking.userId?.email}</p>
                    <p>Date: {booking.serviceDate}</p>
                    <p>Time: {booking.serviceTime}</p>
                    <p className={`appointment-status status-${booking.status}`}>
                      {booking.status}
                    </p>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-recent-activity">
        <h2>Recent Activity</h2>
        <ul className="activity-list">
          {providerData.bookings.slice(-3).map((b, i) => (
            <li key={i} className="activity-item">
              {b.userId?.name} booked {b.serviceId?.name} on {b.serviceDate}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
