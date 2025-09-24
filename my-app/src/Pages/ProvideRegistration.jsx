import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ProviderRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    servicesOffered: [{ name: '', icon: '', desc: '', price: 0, duration: 60 }],
    availability: {
      monday: [{ start: '', end: '' }],
      tuesday: [{ start: '', end: '' }],
      wednesday: [{ start: '', end: '' }],
      thursday: [{ start: '', end: '' }],
      friday: [{ start: '', end: '' }],
      saturday: [{ start: '', end: '' }],
      sunday: [{ start: '', end: '' }],
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = [...formData.servicesOffered];
    newServices[index][name] = value;
    setFormData((prevData) => ({ ...prevData, servicesOffered: newServices }));
  };

  const addService = () => {
    setFormData((prevData) => ({
      ...prevData,
      servicesOffered: [
        ...prevData.servicesOffered,
        { name: '', icon: '', desc: '', price: 0, duration: 60 },
      ],
    }));
  };

  const removeService = (index) => {
    const newServices = [...formData.servicesOffered];
    newServices.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, servicesOffered: newServices }));
  };

  const handleAvailabilityChange = (day, type, value) => {
    const newAvailability = { ...formData.availability };
    newAvailability[day] = [{ ...newAvailability[day][0], [type]: value }];
    setFormData((prevData) => ({
      ...prevData,
      availability: newAvailability,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/provider/register',
        formData
      );
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card provider-reg-card">
        <h1>Provider Registration</h1>
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          

          {/* Availability Section */}
          <div className="form-section">
            <h2>Availability</h2>
            {Object.keys(formData.availability).map((day) => (
              <div key={day} className="availability-group">
                <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                <input
                  type="time"
                  value={formData.availability[day][0]?.start || ''}
                  onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                />
                <span> - </span>
                <input
                  type="time"
                  value={formData.availability[day][0]?.end || ''}
                  onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                />
              </div>
            ))}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Provider'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default ProviderRegistration;
