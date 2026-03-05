import React, { useEffect, useState } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder, getCustomers } from '../Api';
import { Order, Customer } from '../Types';

const empty: Order = { customer: 0 };

export default function Orders() {
  const [items, setItems]       = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm]         = useState<Order>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchAll = async () => {
    try {
      const [oRes, cRes] = await Promise.all([getOrders(), getCustomers()]);
      setItems(oRes.data); setCustomers(cRes.data);
    } catch { setError('Failed to load orders.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      editingId !== null ? await updateOrder(editingId, form) : await createOrder(form);
      setForm(empty); setEditingId(null); setShowForm(false); fetchAll();
    } catch { setError('Failed to save.'); }
  };

  const handleEdit = (item: Order) => {
    setForm({ customer: item.customer });
    setEditingId(item.order_id!); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this order?')) return;
    try { await deleteOrder(id); fetchAll(); }
    catch { setError('Failed to delete.'); }
  };

  const getCustomerName = (id: number) => customers.find(c => c.customer_id === id)?.name || '—';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{items.length} order{items.length !== 1 ? 's' : ''} placed</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setForm(empty); setEditingId(null); }}>
          {showForm ? '✕ Cancel' : '＋ New Order'}
        </button>
      </div>

      {error && <div className="alert-error">{error}<button onClick={() => setError('')}>✕</button></div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">{editingId ? 'Edit Order' : 'New Order'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Customer *</label>
              <select required value={form.customer} onChange={e => setForm({ ...form, customer: Number(e.target.value) })}>
                <option value={0} disabled>Choose a customer...</option>
                {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Order</button>
            <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setForm(empty); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="section-header">
        <h2 className="section-title">All Orders</h2>
        <span className="section-count">{items.length} total</span>
      </div>

      {loading ? <p className="loading">Loading...</p> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="empty-row">No orders yet — create the first one! 🛒</td></tr>
              ) : items.map(item => (
                <tr key={item.order_id}>
                  <td><span className="id-pill">#{item.order_id}</span></td>
                  <td>{item.customer_name || getCustomerName(item.customer)}</td>
                  <td>{item.order_date || <span className="muted">—</span>}</td>
                  <td><div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.order_id!)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}