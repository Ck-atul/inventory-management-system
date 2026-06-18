import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, Users, ShoppingCart, LayoutDashboard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Customers from './components/Customers';
import Orders from './components/Orders';
import './index.css';

const SidebarLinks = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <ul className="nav-links">
      <li><Link to="/" className={isActive('/')}><LayoutDashboard size={20}/> Dashboard</Link></li>
      <li><Link to="/products" className={isActive('/products')}><Package size={20}/> Products</Link></li>
      <li><Link to="/customers" className={isActive('/customers')}><Users size={20}/> Customers</Link></li>
      <li><Link to="/orders" className={isActive('/orders')}><ShoppingCart size={20}/> Orders</Link></li>
    </ul>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <h1 className="logo">Inventory<span>Pro</span></h1>
          <SidebarLinks />
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
