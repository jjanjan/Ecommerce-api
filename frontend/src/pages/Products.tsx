import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../Api';
import { Product } from '../Types';

const empty: Product = { name: '', quantity: 0 };

export default function Products() {
  const [items, setItems]       = useState<Product[]>([]);
  const [form, setForm]         = useState<Product>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchData = async () => {
    try { const r = await getProducts(); setItems(r.data); }
    catch { setError('Failed to load products.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      editingId !== null ? await updateProduct(editingId, form) : await createProduct(form);
      setForm(empty); setEditingId(null); setShowForm(false); fetchData();
    } catch { setError('Failed to save.'); }
  };

  const handleEdit = (item: Product) => {
    setForm({ name: item.name, quantity: item.quantity });
    setEditingId(item.product_id!); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); fetchData(); }
    catch { setError('Failed to delete.'); }
  };

  const stockBadge = (qty: number) => {
    if (qty > 10) return <span className="badge badge-green">✓ {qty} in stock</span>;
    if (qty > 0)  return <span className="badge badge-amber">⚠ {qty} low</span>;
    return <span className="badge badge-red">✕ Out of stock</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{items.length} product{items.length !== 1 ? 's' : ''} in catalog</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setForm(empty); setEditingId(null); }}>
          {showForm ? '✕ Cancel' : '＋ Add Product'}
        </button>
      </div>

      {error && <div className="alert-error">{error}<button onClick={() => setError('')}>✕</button></div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">{editingId ? 'Edit Product' : 'New Product'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Blue T-Shirt" />
            </div>
            <div className="form-group">
              <label>Quantity in Stock *</label>
              <input required type="number" min={0} value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} placeholder="0" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Product</button>
            <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setForm(empty); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="section-header">
        <h2 className="section-title">All Products</h2>
        <span className="section-count">{items.length} total</span>
      </div>

      {loading ? <p className="loading">Loading...</p> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={3} className="empty-row">No products yet — add your first one! 📦</td></tr>
              ) : items.map(item => (
                <tr key={item.product_id}>
                  <td>{item.name}</td>
                  <td>{stockBadge(item.quantity)}</td>
                  <td><div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.product_id!)}>Delete</button>
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