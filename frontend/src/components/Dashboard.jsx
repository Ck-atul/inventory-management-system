import React, { useEffect, useState } from 'react';
import api from '../api';
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStockProducts: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/customers'),
          api.get('/orders')
        ]);

        const products = productsRes.data;
        const lowStock = products.filter(p => p.stock_quantity < 5);

        setStats({
          totalProducts: products.length,
          totalCustomers: customersRes.data.length,
          totalOrders: ordersRes.data.length,
          lowStockProducts: lowStock
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue"><Package size={24} /></div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-green"><Users size={24} /></div>
          <div className="stat-content">
            <h3>Total Customers</h3>
            <p>{stats.totalCustomers}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-purple"><ShoppingCart size={24} /></div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <h3 className="section-title"><AlertTriangle size={20} className="text-warning"/> Low Stock Alerts</h3>
        {stats.lowStockProducts.length === 0 ? (
          <p className="text-secondary">All products have sufficient stock.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>SKU</th><th>Product Name</th><th>Current Stock</th></tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.map(p => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td><span className="badge-danger">{p.stock_quantity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
