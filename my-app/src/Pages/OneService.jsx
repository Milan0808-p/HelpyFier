import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OneService.css';

const ServiceDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get(`http://localhost:5000/services/${id}`);
                setService(response.data);

                // ✅ check ownership
                if (storedUser && storedUser.id === response.data.providerId) {
                    setIsOwner(true);
                }
            } catch (err) {
                console.error("Error fetching service details:", err);
                setError("Failed to load service details. The service may not exist.");
            } finally {
                setLoading(false);
            }
        };
        fetchServiceDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/services/${id}`);
            navigate('/services');
        } catch (err) {
            console.error("Error deleting service:", err);
            setError("Failed to delete service.");
        }
    };

    const handleUpdate = () => {
        navigate(`/update-service/${id}`);
    };

    // ✅ Check authentication before booking
    const handleBookNow = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            alert("You must be logged in to book a service.");
            navigate('/login');
        } else {
            navigate(`/book/${id}`);
        }
    };

    if (loading) {
        return <div className="loading">Loading service details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!service) {
        return <div className="not-found">Service not found.</div>;
    }

    return (
        <div className="service-details-container">
            <div className="service-details-card">
                <img src={service.icon} alt={service.name} className="details-image" />
                <h1>{service.name}</h1>
                <p className="details-description">{service.desc}</p>
                <p className="details-price">
                    Price: <b>₹{service.price}</b>
                </p>

                <div className="action-buttons">
                    {isOwner ? (
                        <>
                            <button className="book-now-button" onClick={handleUpdate}>Update</button>
                            {showConfirm ? (
                                <button className="book-now-button delete-confirm" onClick={handleDelete}>
                                    Confirm Delete
                                </button>
                            ) : (
                                <button className="book-now-button delete-button" onClick={() => setShowConfirm(true)}>Delete</button>
                            )}
                        </>
                    ) : (
                        <button className="book-now-button" onClick={handleBookNow}>Book Now</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsPage;
