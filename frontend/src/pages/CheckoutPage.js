import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState({
    fullName: '', street: '', city: '', province: '', postalCode: '', phone: '',
  });

  const shipping = cartTotal > 5000 ? 0 : 200;
  const total = cartTotal + shipping;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['fullName', 'street', 'city', 'province', 'phone'];
    for (const field of required) {
      if (!form[field]) { toast.error(`Please fill in ${field}`); return; }
    }
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod: 'Cash on Delivery',
      });
      setOrderId(data._id);
      setSuccess(true);
      await clearCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  if (success) {
    return (
      <div className="checkout-success">
        <div className="checkout-success__card">
          <FiCheckCircle size={56} color="var(--success)" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been confirmed and will be delivered soon.</p>
          <div className="checkout-success__id">Order ID: <strong>{orderId}</strong></div>
          <div className="checkout-success__actions">
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
            <button className="btn btn-secondary" onClick={() => navigate('/shop')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header"><h1>Checkout</h1></div>
      <div className="container">
        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Shipping Form */}
          <div className="checkout-form">
            <h3 className="checkout-section-title">Shipping Information</h3>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input name="fullName" className="form-input" placeholder="Ahmed Khan" value={form.fullName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input name="street" className="form-input" placeholder="123 Main Street, Block A" value={form.street} onChange={handleChange} required />
            </div>

            <div className="checkout-form__row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input name="city" className="form-input" placeholder="Lahore" value={form.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Province *</label>
                <select name="province" className="form-select" value={form.province} onChange={handleChange} required>
                  <option value="">Select Province</option>
                  {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'AJK', 'Gilgit-Baltistan'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="checkout-form__row">
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input name="postalCode" className="form-input" placeholder="54000" value={form.postalCode} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input name="phone" className="form-input" placeholder="03XX-XXXXXXX" value={form.phone} onChange={handleChange} required />
              </div>
            </div>

            <h3 className="checkout-section-title" style={{ marginTop: 32 }}>Payment Method</h3>
            <div className="payment-option active">
              <div className="payment-option__radio" />
              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay when your order arrives at your doorstep</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h3 className="checkout-section-title">Order Summary</h3>

            <div className="checkout-items">
              {cart.items?.map(item => (
                <div key={item._id} className="checkout-item">
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                    alt={item.product?.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                  />
                  <div className="checkout-item__info">
                    <span className="checkout-item__name">{item.product?.name}</span>
                    <span className="checkout-item__meta">
                      {item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`} · Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="checkout-item__price">PKR {(item.product?.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span><span>PKR {cartTotal.toLocaleString()}</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `PKR ${shipping}`}</span>
              </div>
              <div className="checkout-total-row checkout-total-row--final">
                <span>Total</span><span>PKR {total.toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={placing}>
              {placing ? 'Placing Order...' : `Place Order · PKR ${total.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
