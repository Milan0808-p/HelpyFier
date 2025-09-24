import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingPage.css";

const BookingPage = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        serviceDate: "",
        serviceTime: "",
        address: "",
        notes: "",
        paymentMethod: ""
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    setUserId(user.id);
                    setFormData(prev => ({
                        ...prev,
                        userName: user.name || "",
                        userEmail: user.email || ""
                    }));
                }

                const res = await axios.get(`http://localhost:5000/services/${serviceId}`);
                setService(res.data);
            } catch (err) {
                console.error("Failed to fetch service", err);
                setMessage("Failed to fetch service details.");
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [serviceId]);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleBooking = async e => {
        e.preventDefault();
        setMessage("");

        if (!userId) {
            setMessage("Please login to book a service.");
            return;
        }

        if (!formData.paymentMethod) {
            setMessage("Please select a payment method.");
            return;
        }

        try {
            if (formData.paymentMethod === "cod") {
                // Simulate offline booking
                await axios.post("http://localhost:5000/api/bookings", {
                    ...formData,
                    serviceId,
                    providerId: service.providerId,
                    userId,
                    paymentStatus: "pending"
                });
                setMessage("Booking successful! Pay offline when the provider confirms.");
                setTimeout(() => navigate("/my-bookings"), 2000);
            } else if (formData.paymentMethod === "online") {
                // Simulate online payment
                await new Promise(resolve => setTimeout(resolve, 1000)); // fake payment delay
                await axios.post("http://localhost:5000/api/bookings", {
                    ...formData,
                    serviceId,
                    providerId: service.providerId,
                    userId,
                    paymentStatus: "paid",
                    paymentDetails: { mockPaymentId: "MOCK12345" }
                });
                setMessage("Booking & online payment successful!");
                setTimeout(() => navigate("/my-bookings"), 2000);
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Booking failed.");
        }
    };

    if (loading) return <p className="loading">Loading service details...</p>;
    if (message && message.includes("Failed")) return <p className="error">{message}</p>;
    if (!service) return <p className="not-found">Service details not found.</p>;

    return (
        <div className="booking-container">
            <h1 className="booking-title">Book {service.name}</h1>
            <p className="booking-description">{service.desc}</p>
            <p className="booking-price"><strong>Price:</strong> ₹{service.price}</p>

            <form onSubmit={handleBooking} className="booking-form">
                <div>
                    <label>Name</label>
                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} required />
                </div>

                <div>
                    <label>Date</label>
                    <input type="date" name="serviceDate" value={formData.serviceDate} onChange={handleChange} required />
                </div>

                <div>
                    <label>Time</label>
                    <input type="time" name="serviceTime" value={formData.serviceTime} onChange={handleChange} required />
                </div>

                <div>
                    <label>Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>
                </div>

                <div>
                    <label>Notes (optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
                </div>

                <div>
                    <label>Payment Method</label>
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                        <option value="">Select Payment Method</option>
                        <option value="cod">Cash on Delivery</option>
                        <option value="online">Online Payment (Simulated)</option>
                    </select>
                </div>

                <button type="submit">Confirm Booking</button>
            </form>

            {message && <p className="success">{message}</p>}
        </div>
    );
};

export default BookingPage;
