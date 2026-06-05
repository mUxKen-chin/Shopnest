import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, cartTotal, updateQuantity, removeItem, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 5000 ? 0 : 200;
  const total = cartTotal + shipping;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div>
        <div className="page-header"><h1>Shopping Cart</h1></div>
        <div className="empty-state">
          <FiShoppingBag size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header"><h1>Shopping Cart</h1><p>{cart.items.length} items</p></div>
      <div className="container">
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-items__header">
              <Link to="/shop" className="cart-back-link"><FiArrowLeft size={16} /> Continue Shopping</Link>
            </div>

            {cart.items.map(item => (
              <div key={item._id} className="cart-item">
                <Link to={`/product/${item.product?._id}`} className="cart-item__image">
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                    alt={item.product?.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Item'; }}
                  />
                </Link>
                <div className="cart-item__info">
                  <Link to={`/product/${item.product?._id}`} className="cart-item__name">{item.product?.name}</Link>
                  <div className="cart-item__meta">
                    {item.size && <span>Size: <strong>{item.size}</strong></span>}
                    {item.color && <span>Color: <strong>{item.color}</strong></span>}
                  </div>
                  <div className="cart-item__price-row">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={loading}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={loading}>+</button>
                    </div>
                    <span className="cart-item__price">PKR {(item.product?.price * item.quantity).toLocaleString()}</span>
                    <button className="cart-item__remove" onClick={() => removeItem(item._id)} disabled={loading}>
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 className="cart-summary__title">Order Summary</h3>

            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>PKR {cartTotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `PKR ${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="cart-summary__shipping-note">
                  <FiTruck size={12} /> Add PKR {(5000 - cartTotal).toLocaleString()} more for free shipping
                </p>
              )}
            </div>

            <div className="cart-summary__total">
              <span>Total</span>
              <span>PKR {total.toLocaleString()}</span>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 20 }}
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            <div className="cart-summary__security">
              🔒 Secure checkout · Cash on Delivery available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
