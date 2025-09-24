import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
 // Reuse existing CSS
import './OneService.css'; // Reuse existing CSS

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    desc: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/services/${id}`);
        setFormData(response.data); // Populate form with existing data
      } catch (err) {
        console.error("Failed to fetch service data for editing:", err);
        setError("Could not load service for editing. It may not exist.");
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/services/${id}`, formData);
      console.log("Service updated successfully!");
      navigate(`/services/${id}`); // Redirect back to the service details page
    } catch (err) {
      console.error("Error updating service:", err);
      setError("Failed to update service.");
    }
  };
  
  if (loading) {
    return <div className="loading">Loading service details for editing...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="service-details-container">
      <div className="service-details-card">
        <h1>Edit Service</h1>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="name">Service Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="icon">Image URL</label>
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
          <div className="button-group">
            <button type="submit" className="book-now-button">Save Changes</button>
            <button type="button" className="book-now-button" onClick={() => navigate(`/services/${id}`)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;
