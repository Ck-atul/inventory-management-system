import React, { useEffect, useState } from 'react';
import api from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', sku: '', description: '', price: '', stock_quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchProducts = () => {
    api.get('/products').then(res => setProducts(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
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
      const payload = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description || null,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity, 10)
      };

      if (isEditing) {
        await api.put(`/products/${formData.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      
      setFormData({ id: null, name: '', sku: '', description: '', price: '', stock_quantity: '' });
      setIsEditing(false);
      setSuccess(isEditing ? "Product updated successfully!" : "Product added successfully!");
      fetchProducts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  const editProduct = (p) => {
    setFormData({ id: p.id, name: p.name, sku: p.sku, description: p.description || '', price: p.price, stock_quantity: p.stock_quantity });
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <div className="view-container">
      <div className="card form-card">
        <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} required />
            <input type="text" name="sku" placeholder="SKU / Code" value={formData.sku} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleInputChange} step="0.01" min="0.01" required />
            <input type="number" name="stock_quantity" placeholder="Stock Quantity" value={formData.stock_quantity} onChange={handleInputChange} min="0" required />
          </div>
          <input type="text" name="description" placeholder="Description (Optional)" value={formData.description} onChange={handleInputChange} className="full-width" />
          <div className="form-actions">
            <button type="submit" className="btn-primary">{isEditing ? 'Update Product' : 'Add Product'}</button>
            {isEditing && <button type="button" className="btn-secondary" onClick={() => { setIsEditing(false); setFormData({ id: null, name: '', sku: '', description: '', price: '', stock_quantity: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card mt-2">
        <h2>Product List</h2>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>SKU</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.sku}</td><td>{p.name}</td><td>₹{p.price.toFixed(2)}</td>
                <td><span className={p.stock_quantity > 0 ? "badge-success" : "badge-danger"}>{p.stock_quantity}</span></td>
                <td>
                  <button className="btn-small text-info mr-1" onClick={() => editProduct(p)}>Edit</button>
                  <button className="btn-small text-danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="6" className="text-center">No products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
