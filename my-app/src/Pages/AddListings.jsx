import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddListings.css';

const AddListings = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [providerId, setProviderId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        desc: '',
        price: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role === 'provider') {
            setIsLoggedIn(true);
            setUserRole(storedUser.role);
            setProviderId(storedUser.id);
        } else {
            setIsLoggedIn(false);
            setError('You must be logged in as a provider to add a listing.');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAddListing = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Include the providerId in the data sent to the backend
            const payload = {
                ...formData,
                providerId: providerId
            };
            
            await axios.post('http://localhost:5000/add-listing', payload);
            setSuccess('Listing added successfully!');
            setTimeout(() => navigate('/services'), 2000);
        } catch (err) {
            console.error('Error adding listing:', err);
            setError(err.response?.data || 'Failed to add listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    if (!isLoggedIn || userRole !== 'provider') {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Access Denied</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Add New Listing</h1>
                <form onSubmit={handleAddListing}>
                    <div className="form-group">
                        <label htmlFor="name">Service Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="icon">Icon URL</label>
                        <input type="url" id="icon" name="icon" value={formData.icon} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <textarea id="desc" name="desc" value={formData.desc} onChange={handleChange} required></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Listing'}
                    </button>
                </form>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default AddListings;
