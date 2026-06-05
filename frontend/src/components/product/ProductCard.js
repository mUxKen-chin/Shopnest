import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to add to cart'); return; }
    setAdding(true);
    const size = product.sizes?.[0];
    const color = product.colors?.[0];
    const result = await addToCart(product._id, 1, size, color);
    if (result.success) toast.success('Added to cart!');
    else toast.error(result.message);
    setAdding(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.round(rating) ? 'var(--secondary)' : 'var(--border)' }}>★</span>
    ));
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card__image-wrap">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.name}
          className="product-card__image"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=ShopNest'; }}
        />

        {/* Badges */}
        <div className="product-card__badges">
          {product.isNew && <span className="badge badge-new">New</span>}
          {discount && <span className="badge badge-sale">-{discount}%</span>}
          {product.stock === 0 && <span className="badge" style={{ background: '#666', color: '#fff' }}>Sold Out</span>}
        </div>

        {/* Actions overlay */}
        <div className="product-card__actions">
          <button
            className={`product-card__action-btn ${wishlist ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setWishlist(!wishlist); }}
            title="Wishlist"
          >
            <FiHeart size={16} fill={wishlist ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/product/${product._id}`}
            className="product-card__action-btn"
            title="Quick View"
            onClick={(e) => e.stopPropagation()}
          >
            <FiEye size={16} />
          </Link>
        </div>
      </Link>

      <div className="product-card__info">
        <div className="product-card__category">{product.category}</div>
        <Link to={`/product/${product._id}`} className="product-card__name">{product.name}</Link>

        <div className="product-card__rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="product-card__reviews">({product.numReviews})</span>
        </div>

        <div className="product-card__bottom">
          <div className="product-card__prices">
            <span className="product-card__price">PKR {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="product-card__original">PKR {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button
            className="product-card__add-btn"
            onClick={handleQuickAdd}
            disabled={adding || product.stock === 0}
          >
            <FiShoppingBag size={15} />
            {adding ? '...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
