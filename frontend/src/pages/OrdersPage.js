import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';
import './OrdersPage.css';

const STATUS_COLORS = {
  Pending: '#e67e22',
  Processing: '#2980b9',
  Shipped: '#8e44ad',
  Delivered: '#27ae60',
  Cancelled: '#c0392b',
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header"><h1>My Orders</h1><p>{orders.length} orders</p></div>
      <div className="container" style={{ padding: '40px 24px 80px' }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <FiPackage size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <h3>No orders yet</h3>
            <p>Once you place an order, it will appear here</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="order-card">
                <div className="order-card__header">
                  <div>
                    <span className="order-card__id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-card__date">{new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="order-card__status" style={{ color: STATUS_COLORS[order.status], background: STATUS_COLORS[order.status] + '18' }}>
                      {order.status}
                    </span>
                    <FiChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
                <div className="order-card__body">
                  <div className="order-card__items">
                    {order.orderItems.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.image || 'https://via.placeholder.com/50'} alt={item.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} className="order-card__item-img" />
                    ))}
                    {order.orderItems.length > 3 && <span className="order-card__more">+{order.orderItems.length - 3}</span>}
                  </div>
                  <div className="order-card__info">
                    <span>{order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}</span>
                    <span className="order-card__total">PKR {order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!order) return <div className="empty-state"><h3>Order not found</h3><Link to="/orders" className="btn btn-primary">My Orders</Link></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Order Details</h1>
        <p>#{order._id.slice(-8).toUpperCase()}</p>
      </div>
      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div className="order-detail-layout">
          <div className="order-detail-main">
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3>Order Items</h3>
                <span className="order-card__status" style={{ color: STATUS_COLORS[order.status], background: STATUS_COLORS[order.status] + '18' }}>
                  {order.status}
                </span>
              </div>
              {order.orderItems.map((item, i) => (
                <div key={i} className="order-detail-item">
                  <img src={item.image || 'https://via.placeholder.com/70'} alt={item.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/70'; }} />
                  <div className="order-detail-item__info">
                    <span className="order-detail-item__name">{item.name}</span>
                    <span className="text-muted text-sm">
                      {item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`} · Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="order-detail-item__price">PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16 }}>Shipping Address</h3>
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="card" style={{ padding: 24, height: 'fit-content' }}>
            <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
            <div className="checkout-totals">
              <div className="checkout-total-row"><span>Subtotal</span><span>PKR {order.itemsPrice.toLocaleString()}</span></div>
              <div className="checkout-total-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `PKR ${order.shippingPrice}`}</span></div>
              <div className="checkout-total-row checkout-total-row--final"><span>Total</span><span>PKR {order.totalPrice.toLocaleString()}</span></div>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong>Payment:</strong> {order.paymentMethod}<br />
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <Link to="/orders" className="btn btn-secondary btn-full" style={{ marginTop: 16 }}>Back to Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
