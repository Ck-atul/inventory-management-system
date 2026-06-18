import React, { useEffect, useState } from 'react';
import api from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ customer_id: '', items: [] });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchData = async () => {
    try {
      const [ordRes, custRes, prodRes] = await Promise.all([
        api.get('/orders'), api.get('/customers'), api.get('/products')
      ]);
      setOrders(ordRes.data);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addItem = () => {
    if (!selectedProduct || selectedQuantity < 1) return;
    const prod = products.find(p => p.id === parseInt(selectedProduct));
    if (prod.stock_quantity < selectedQuantity) {
      setError(`Not enough stock for ${prod.name}`);
      return;
    }
    
    setFormData(prev => {
      const existingItem = prev.items.find(i => i.product_id === prod.id);
      if (existingItem) {
        return { ...prev, items: prev.items.map(i => i.product_id === prod.id ? { ...i, quantity: i.quantity + parseInt(selectedQuantity) } : i) };
      }
      return { ...prev, items: [...prev.items, { product_id: prod.id, name: prod.name, price: prod.price, quantity: parseInt(selectedQuantity) }] };
    });
    setError(null);
  };

  const removeItem = (prodId) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.product_id !== prodId) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    if (!formData.customer_id || formData.items.length === 0) {
      setError("Please select a customer and add at least one item.");
      return;
    }
    setError(null);
    try {
      const payload = {
        customer_id: parseInt(formData.customer_id),
        status: "Pending",
        items: formData.items.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
      };
      await api.post('/orders', payload);
      setFormData({ customer_id: '', items: [] });
      setSuccess("Order placed successfully!");
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to cancel and delete this order? Stock will be restored.")) {
      try {
        await api.delete(`/orders/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete order.");
      }
    }
  };

  const toggleDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="view-container">
      <div className="card form-card">
        <h3>Create New Order</h3>
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group full-width">
            <select name="customer_id" value={formData.customer_id} onChange={(e) => setFormData({...formData, customer_id: e.target.value})} required>
              <option value="">-- Select Customer --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
            </select>
          </div>
          
          <div className="order-items-builder">
            <h4>Add Products</h4>
            <div className="form-group add-item-row">
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="">-- Select Product --</option>
                {products.map(p => <option key={p.id} value={p.id} disabled={p.stock_quantity === 0}>{p.name} (₹{p.price.toFixed(2)}) - {p.stock_quantity} in stock</option>)}
              </select>
              <input type="number" value={selectedQuantity} onChange={(e) => setSelectedQuantity(e.target.value)} min="1" placeholder="Qty" className="qty-input" />
              <button type="button" className="btn-secondary" onClick={addItem}>Add</button>
            </div>
            
            {formData.items.length > 0 && (
              <ul className="selected-items-list">
                {formData.items.map(item => (
                  <li key={item.product_id}>
                    <span>{item.name} - Qty: {item.quantity} (₹{(item.price * item.quantity).toFixed(2)})</span>
                    <button type="button" className="text-danger btn-small" onClick={() => removeItem(item.product_id)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="order-total-preview">
               Total: ₹{formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={formData.items.length === 0}>Place Order</button>
          </div>
        </form>
      </div>

      <div className="card mt-2">
        <h2>Order List</h2>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Status</th><th>Date</th><th>Total</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <React.Fragment key={o.id}>
                <tr>
                  <td>{o.id}</td>
                  <td>{customers.find(c => c.id === o.customer_id)?.full_name || o.customer_id}</td>
                  <td><span className="badge-info">{o.status}</span></td>
                  <td>{new Date(o.order_date).toLocaleDateString()}</td>
                  <td>₹{o.total_amount ? o.total_amount.toFixed(2) : "0.00"}</td>
                  <td>
                    <button className="btn-small text-info mr-1" onClick={() => toggleDetails(o.id)}>{expandedOrderId === o.id ? 'Hide Details' : 'View Details'}</button>
                    <button className="btn-small text-danger" onClick={() => deleteOrder(o.id)}>Cancel Order</button>
                  </td>
                </tr>
                {expandedOrderId === o.id && (
                  <tr className="expanded-row">
                    <td colSpan="6">
                      <div className="order-details-box">
                        <h4>Order Items</h4>
                        <ul>
                          {o.items.map(i => (
                            <li key={i.id}>
                              Product ID: {i.product_id} | Qty: {i.quantity} | Unit Price: ₹{i.unit_price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {orders.length === 0 && <tr><td colSpan="6" className="text-center">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
