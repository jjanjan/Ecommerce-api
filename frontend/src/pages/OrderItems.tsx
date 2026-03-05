import React, { useEffect, useState } from 'react';
import { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem, getOrders, getProducts } from '../Api';
import { OrderItem, Order, Product } from '../Types';

const empty: OrderItem = { order: 0, product: 0, quantity: 1 };

export default function OrderItems() {
  const [items, setItems]       = useState<OrderItem[]>([]);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm]         = useState<OrderItem>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchAll = async () => {
    try {
      const [iRes, oRes, pRes] = await Promise.all([getOrderItems(), getOrders(), getProducts()]);
      setItems(iRes.data); setOrders(oRes.data); setProducts(pRes.data);
    } catch { setError('Failed to load order items.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      editingId !== null ? await updateOrderItem(editingId, form) : await createOrderItem(form);
      setForm(empty); setEditingId(null); setShowForm(false); fetchAll();
    } catch { setError('Failed to save.'); }
  };

  const handleEdit = (item: OrderItem) => {
    setForm({ order: item.order, product: item.product, quantity: item.quantity });
    setEditingId(item.id!); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this item?')) return;
    try { await deleteOrderItem(id); fetchAll(); }
    catch { setError('Failed to delete.'); }
  };

  const getOrderLabel  = (id: number) => orders.find(o => o.order_id === id) ? `Order #${id}` : '—';
  const getProductName = (id: number) => products.find(p => p.product_id === id)?.name || '—';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Items</h1>
          <p className="page-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} across all orders</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setForm(empty); setEditingId(null); }}>
          {showForm ? '✕ Cancel' : '＋ Add Item'}
        </button>
      </div>

      {error && <div className="alert-error">{error}<button onClick={() => setError('')}>✕</button></div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">{editingId ? 'Edit Order Item' : 'New Order Item'}</h2>
          <div className="form-grid-3">
            <div className="form-group">
              <label>Order *</label>
              <select required value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })}>
                <option value={0} disabled>Select order...</option>
                {orders.map(o => <option key={o.order_id} value={o.order_id}>Order #{o.order_id}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Product *</label>
              <select required value={form.product} onChange={e => setForm({ ...form, product: Number(e.target.value) })}>
                <option value={0} disabled>Select product...</option>
                {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input required type="number" min={1} value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Item</button>
            <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setForm(empty); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="section-header">
        <h2 className="section-title">All Order Items</h2>
        <span className="section-count">{items.length} total</span>
      </div>

      {loading ? <p className="loading">Loading...</p> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="empty-row">No order items yet — add one! 📋</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td><span className="id-pill">{item.order_display || getOrderLabel(item.order)}</span></td>
                  <td>{item.product_name || getProductName(item.product)}</td>
                  <td><span className="badge badge-indigo">× {item.quantity}</span></td>
                  <td><div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id!)}>Delete</button>
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