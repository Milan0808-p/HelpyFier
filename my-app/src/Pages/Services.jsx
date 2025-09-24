import React, { useState, useEffect } from "react";
import "./Services.css";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function ServicePage() {
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProvider, setIsProvider] = useState(false);
  const [providerId, setProviderId] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.role === "provider") {
      setIsProvider(true);
      setProviderId(storedUser.id);
    }

    const fetchServices = async () => {
      try {
        let response;
        if (storedUser && storedUser.role === "provider") {
          response = await axios.get(
            `http://localhost:5000/api/provider/services/${storedUser.id}`
          );
        } else {
          response = await axios.get("http://localhost:5000");
        }
        setAllServices(response.data);
      } catch (err) {
        console.error("There was an error fetching the services:", err);
        setError("Failed to load services. Please check the backend connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ✅ Filter services by search query (without changing API call)
  const filteredServices = searchQuery
    ? allServices.filter((service) =>
        service.name.toLowerCase().includes(searchQuery)
      )
    : allServices;

  if (loading) {
    return <div className="loading-message">Loading services...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (isProvider && allServices.length === 0) {
    return (
      <div className="servicepage-container">
        <h1 className="servicepage-title">My Services</h1>
        <p className="no-services-message">You have not added any services yet.</p>
        <p className="no-services-message">
          Please go to "Add Service" to create your first listing.
        </p>
      </div>
    );
  }

  return (
    <div className="servicepage-container">
      <h1 className="servicepage-title">
        {isProvider ? "My Services" : "All Services"}
      </h1>

      {/* ✅ Show search results message if query is present */}
      {searchQuery && (
        <p className="search-result-message">
          Showing results for: <b>{searchQuery}</b>
        </p>
      )}

      <div className="servicepage-list">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Link to={`/services/${service._id}`} key={service._id}>
              <div className="servicepage-card">
                <img
                  src={service.icon}
                  alt={service.name}
                  className="service-image"
                />
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
                <p className="servicepage-price">
                  <b>₹{service.price}</b>
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-services-message">No matching services found.</p>
        )}
      </div>
    </div>
  );
}

export default ServicePage;
