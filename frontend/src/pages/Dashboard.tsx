import React, { useEffect, useState } from 'react';
import { getCustomers, getProducts, getOrders, getOrderItems } from '../Api';

export default function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, products: 0, orders: 0, orderItems: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCustomers(), getProducts(), getOrders(), getOrderItems()])
      .then(([c, p, o, oi]) =>
        setStats({ customers: c.data.length, products: p.data.length, orders: o.data.length, orderItems: oi.data.length })
      ).finally(() => setLoading(false));
  }, []);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

  const cards = [
    { label: 'Total Customers', value: stats.customers,  icon: '👥', accent: '#4361ee', bg: '#eef0fd', trend: 'Active' },
    { label: 'Products Listed', value: stats.products,   icon: '📦', accent: '#8b5cf6', bg: '#ede9fe', trend: 'In catalog' },
    { label: 'Total Orders',    value: stats.orders,     icon: '🛒', accent: '#06b6d4', bg: '#e0f7fa', trend: 'Placed' },
    { label: 'Order Items',     value: stats.orderItems, icon: '📋', accent: '#10b981', bg: '#d1fae5', trend: 'Line items' },
  ];

  const guides = [
    { icon: '👥', title: 'Customers', desc: 'Add customers first — required when creating orders.' },
    { icon: '📦', title: 'Products',  desc: 'Manage catalog and track stock quantities.' },
    { icon: '🛒', title: 'Orders',    desc: 'Create orders and link them to a customer.' },
    { icon: '📋', title: 'Order Items', desc: 'Add products to orders with quantities.' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <div className="hero-title">{greeting}! 👋</div>
          <div className="hero-sub">Here's what's happening in your store today.</div>
        </div>
        <div className="hero-emoji">🛍️</div>
      </div>

      {/* Stat Cards */}
      {loading ? <p className="loading">Loading stats...</p> : (
        <div className="stats-grid">
          {cards.map(card => (
            <div className="stat-card" key={card.label} style={{ '--accent': card.accent } as any}>
              <div className="stat-card-top">
                <div className="stat-icon-box" style={{ background: card.bg }}>{card.icon}</div>
                <span className="stat-trend neu">{card.trend}</span>
              </div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Guide */}
      <div className="section-header">
        <h2 className="section-title">Quick Guide</h2>
      </div>
      <div className="guide-grid">
        {guides.map(g => (
          <div className="guide-card" key={g.title}>
            <span className="guide-icon">{g.icon}</span>
            <div className="guide-title">{g.title}</div>
            <div className="guide-desc">{g.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}