import React, { useEffect, useState } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../Api';
import { Customer } from '../Types';

const empty: Customer = { name: '', email: '' };

export default function Customers() {
  const [items, setItems]       = useState<Customer[]>([]);
  const [form, setForm]         = useState<Customer>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchData = async () => {
    try { const r = await getCustomers(); setItems(r.data); }
    catch { setError('Failed to load customers.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      editingId !== null ? await updateCustomer(editingId, form) : await createCustomer(form);
      setForm(empty); setEditingId(null); setShowForm(false); fetchData();
    } catch { setError('Failed to save.'); }
  };

  const handleEdit = (item: Customer) => {
    setForm({ name: item.name, email: item.email });
    setEditingId(item.customer_id!); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this customer?')) return;
    try { await deleteCustomer(id); fetchData(); }
    catch { setError('Failed to delete.'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{items.length} registered customer{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setForm(empty); setEditingId(null); }}>
          {showForm ? '✕ Cancel' : '＋ Add Customer'}
        </button>
      </div>

      {error && <div className="alert-error">{error}<button onClick={() => setError('')}>✕</button></div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">{editingId ? 'Edit Customer' : 'New Customer'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jane Smith" />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Customer</button>
            <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setForm(empty); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="section-header">
        <h2 className="section-title">All Customers</h2>
        <span className="section-count">{items.length} total</span>
      </div>

      {loading ? <p className="loading">Loading...</p> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={3} className="empty-row">No customers yet — add your first one! 👤</td></tr>
              ) : items.map(item => (
                <tr key={item.customer_id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td><div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.customer_id!)}>Delete</button>
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