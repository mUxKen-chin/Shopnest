import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import api from '../../utils/api';
import './Admin.css';

const STATUS_COLORS = { Pending: '#e67e22', Processing: '#2980b9', Shipped: '#8e44ad', Delivered: '#27ae60', Cancelled: '#c0392b' };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with ShopNest.</p>
        </div>
      </div>

      <div className="container admin-content">
        {/* Stat Cards */}
        <div className="admin-stats">
          {[
            { label: 'Total Revenue', value: `PKR ${stats.totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: '#27ae60' },
            { label: 'Total Orders', value: stats.totalOrders, icon: <FiPackage />, color: '#2980b9' },
            { label: 'Total Products', value: stats.totalProducts, icon: <FiShoppingBag />, color: '#8e44ad' },
            { label: 'Total Customers', value: stats.totalUsers, icon: <FiUsers />, color: '#e67e22' },
          ].map((s, i) => (
            <div key={i} className="admin-stat-card">
              <div className="admin-stat-card__icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div>
                <div className="admin-stat-card__value">{s.value}</div>
                <div className="admin-stat-card__label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-grid">
          {/* Recent Orders */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders" className="admin-card__link">View All <FiArrowRight size={14} /></Link>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td><Link to={`/orders/${order._id}`} className="admin-table__link">#{order._id.slice(-6).toUpperCase()}</Link></td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>PKR {order.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className="admin-status" style={{ color: STATUS_COLORS[order.status], background: STATUS_COLORS[order.status] + '18' }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="admin-card">
            <div className="admin-card__header"><h3>Order Status</h3></div>
            <div className="admin-status-list">
              {stats.ordersByStatus.map(s => (
                <div key={s._id} className="admin-status-item">
                  <span className="admin-status" style={{ color: STATUS_COLORS[s._id], background: STATUS_COLORS[s._id] + '18' }}>{s._id}</span>
                  <div className="admin-status-bar">
                    <div className="admin-status-bar__fill" style={{ width: `${(s.count / stats.totalOrders) * 100}%`, background: STATUS_COLORS[s._id] }} />
                  </div>
                  <span className="admin-status-count">{s.count}</span>
                </div>
              ))}
            </div>

            <div className="admin-quick-links">
              <h4>Quick Actions</h4>
              <Link to="/admin/products" className="admin-quick-link"><FiShoppingBag /> Manage Products</Link>
              <Link to="/admin/orders" className="admin-quick-link"><FiPackage /> Manage Orders</Link>
              <Link to="/admin/users" className="admin-quick-link"><FiUsers /> Manage Users</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
