import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBooking.css';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // New state for tab

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'user') {
            setUserId(storedUser.id);
        } else {
            setError("You must be a user to view this page.");
            setLoading(false);
            return;
        }

        const fetchMyBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/bookings/${storedUser.id}`);
                setMyBookings(response.data);
            } catch (err) {
                console.error("Error fetching my bookings:", err);
                setError("Failed to load your bookings. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchMyBookings();
        }
    }, [userId]);

    if (loading) {
        return <div className="loading-message">Loading your bookings...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Filter bookings based on active tab
    const filteredBookings = activeTab === 'all' 
        ? myBookings 
        : myBookings.filter(b => b.status === activeTab);

    return (
        <div className="my-bookings-container">
            <h1 className="my-bookings-title">My Bookings</h1>

            {/* ---------- Tab Navigation ---------- */}
            <div className="tabs">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {filteredBookings.length > 0 ? (
                <div className="my-bookings-grid">
                    {filteredBookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <h3 className="service-name">{booking.serviceId.name}</h3>
                            <p className="provider-name">Provider: {booking.providerId?.name || booking.providerId}</p>
                            <p className="booking-date">Date: {booking.serviceDate}</p>
                            <p className="booking-time">Time: {booking.serviceTime}</p>
                            <p className="booking-status">
                                Status: <span className={`status-${booking.status}`}>{booking.status}</span>
                            </p>
                            <p className="booking-notes">Notes: {booking.notes}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-bookings-message">No bookings in this category.</p>
            )}
        </div>
    );
};

export default MyBookings;
