import React, { useEffect, useState } from "react";
import axios from "axios";

const Provider_Myservices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role !== "provider") {
      setError("You must be logged in as a provider to view this page.");
      setLoading(false);
      return;
    }

    const providerId = storedUser.id;

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/provider/services/${providerId}`
        );
        setServices(response.data);
      } catch (err) {
        console.error("Error fetching provider services:", err);
        setError("Failed to fetch provider services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Services</h1>
      {services.length === 0 ? (
        <p>No services found</p>
      ) : (
        <ul>
          {services.map((service, idx) => (
            <div className="servicepage-card">
              <img src={service.icon} alt={service.name} className="service-image" />
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <p className="servicepage-price">
                <b>₹{service.price}</b>
              </p>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Provider_Myservices;
