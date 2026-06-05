import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Admin.css';

const CATEGORIES = ["Men's Tops", "Men's Bottoms", "Women's Tops", "Women's Bottoms", "Outerwear", "Footwear", "Accessories"];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', 'One Size'];

const emptyForm = {
  name: '', description: '', price: '', originalPrice: '', category: "Men's Tops",
  gender: 'Men', sizes: [], colors: '', images: '', stock: '', featured: false, isNew: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    const { data } = await api.get('/admin/products');
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }));
  };

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '',
      category: p.category, gender: p.gender, sizes: p.sizes || [],
      colors: p.colors?.join(', ') || '', images: p.images?.join(', ') || '',
      stock: p.stock, featured: p.featured, isNew: p.isNew,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
        images: form.images.split(',').map(i => i.trim()).filter(Boolean),
      };
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product added!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header__inner">
          <div><h1>Products</h1><p>{products.length} total products</p></div>
          <button className="btn btn-gold" onClick={openAdd}><FiPlus size={16} /> Add Product</button>
        </div>
      </div>

      <div className="container admin-content">
        <div className="admin-card">
          <div className="admin-card__header">
            <input
              type="text"
              placeholder="Search products..."
              className="form-input"
              style={{ maxWidth: 300 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? <div className="loading-center"><div className="spinner" /></div> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div className="admin-product-cell">
                          <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt={p.name}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>PKR {p.price.toLocaleString()}</td>
                      <td>
                        <span style={{ color: p.stock < 5 ? 'var(--error)' : 'var(--success)', fontWeight: 500 }}>
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.featured ? <FiCheck color="var(--success)" /> : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="admin-action-btn admin-action-btn--edit" onClick={() => openEdit(p)}><FiEdit2 size={14} /></button>
                          <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(p._id, p.name)}><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="admin-form-grid">
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Product Name *</label>
                  <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description *</label>
                  <textarea name="description" className="form-input" rows={3} value={form.description} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (PKR) *</label>
                  <input name="price" type="number" className="form-input" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (PKR)</label>
                  <input name="originalPrice" type="number" className="form-input" value={form.originalPrice} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                    {['Men', 'Women', 'Unisex'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input name="stock" type="number" className="form-input" value={form.stock} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Colors (comma separated)</label>
                  <input name="colors" className="form-input" placeholder="Black, White, Red" value={form.colors} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Image URLs (comma separated)</label>
                  <input name="images" className="form-input" placeholder="https://..." value={form.images} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Sizes</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SIZES.map(s => (
                      <button
                        key={s}
                        type="button"
                        className={`filter-chip ${form.sizes.includes(s) ? 'active' : ''}`}
                        onClick={() => toggleSize(s)}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                    <span className="form-label" style={{ margin: 0 }}>Featured Product</span>
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} />
                    <span className="form-label" style={{ margin: 0 }}>New Arrival</span>
                  </label>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
