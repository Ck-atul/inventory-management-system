import React, { useEffect, useState } from 'react';
import api from '../api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchCustomers = () => {
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.post('/customers', formData);
      setFormData({ full_name: '', email: '', phone: '' });
      setSuccess("Customer added successfully!");
      fetchCustomers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        alert("Failed to delete customer. Ensure they have no active orders.");
      }
    }
  };

  return (
    <div className="view-container">
      <div className="card form-card">
        <h3>Add New Customer</h3>
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
          </div>
          <input type="text" name="phone" placeholder="Phone Number (Optional)" value={formData.phone} onChange={handleInputChange} className="full-width" />
          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Customer</button>
          </div>
        </form>
      </div>

      <div className="card mt-2">
        <h2>Customer List</h2>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Full Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.full_name}</td><td>{c.email}</td><td>{c.phone || '-'}</td>
                <td>
                  <button className="btn-small text-danger" onClick={() => deleteCustomer(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan="5" className="text-center">No customers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
