import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import OrderItems from './pages/OrderItems';

type Page = 'dashboard' | 'customers' | 'products' | 'orders' | 'orderitems';

const navItems: { key: Page; label: string; icon: string }[] = [
  { key: 'dashboard',  label: 'Dashboard',   icon: '🏠' },
  { key: 'customers',  label: 'Customers',   icon: '👥' },
  { key: 'products',   label: 'Products',    icon: '📦' },
  { key: 'orders',     label: 'Orders',      icon: '🛒' },
  { key: 'orderitems', label: 'Order Items', icon: '📋' },
];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <Dashboard />;
      case 'customers':  return <Customers />;
      case 'products':   return <Products />;
      case 'orders':     return <Orders />;
      case 'orderitems': return <OrderItems />;
    }
  };

  const go = (key: Page) => { setPage(key); setMobileOpen(false); };

  return (
    <div className="app-shell">

      {/* ── Top Navbar ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-logo">🛍️</div>
          <span className="brand-name">ShopAdmin</span>
          <div className="brand-dot" />
        </div>

        {/* desktop links */}
        <div className="navbar-links">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-link ${page === item.key ? 'active' : ''}`}
              onClick={() => go(item.key)}
            >
              <span className="nav-link-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <span className="navbar-badge">Ecommerce Panel</span>
        </div>

        {/* mobile hamburger */}
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* ── Mobile Nav Drawer ── */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <button
            key={item.key}
            className={`nav-link ${page === item.key ? 'active' : ''}`}
            onClick={() => go(item.key)}
          >
            <span className="nav-link-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Page Content ── */}
      <div className="content-area">
        {renderPage()}
      </div>

    </div>
  );
}