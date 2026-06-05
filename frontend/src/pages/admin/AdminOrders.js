import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Admin.css';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = { Pending: '#e67e22', Processing: '#2980b9', Shipped: '#8e44ad', Delivered: '#27ae60', Cancelled: '#c0392b' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    const { data } = await api.get('/admin/orders');
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>Orders</h1>
          <p>{orders.length} total orders</p>
        </div>
      </div>

      <div className="container admin-content">
        {/* Filter tabs */}
        <div className="admin-filter-tabs">
          <button className={`admin-filter-tab ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>All ({orders.length})</button>
          {STATUSES.map(s => (
            <button key={s} className={`admin-filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}
              style={filter === s ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}>
              {s} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>

        <div className="admin-card">
          {loading ? <div className="loading-center"><div className="spinner" /></div> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order._id}>
                      <td><strong>#{order._id.slice(-8).toUpperCase()}</strong></td>
                      <td>
                        <div>{order.user?.name || 'N/A'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.user?.email}</div>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.orderItems.length} items</td>
                      <td><strong>PKR {order.totalPrice.toLocaleString()}</strong></td>
                      <td>
                        <span className="admin-status" style={{ color: STATUS_COLORS[order.status], background: STATUS_COLORS[order.status] + '18' }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '6px 10px', fontSize: 12, width: 130 }}
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
