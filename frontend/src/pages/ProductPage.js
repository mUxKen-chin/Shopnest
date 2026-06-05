import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiShare2, FiTruck, FiRefreshCw, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.info('Please login to add items to cart'); return; }
    if (!selectedSize) { toast.warning('Please select a size'); return; }
    setAdding(true);
    const result = await addToCart(product._id, quantity, selectedSize, selectedColor);
    if (result.success) toast.success('Added to cart!');
    else toast.error(result.message);
    setAdding(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to submit a review'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/review`, review);
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < (interactive ? review.rating : Math.round(rating)) ? 'var(--secondary)' : 'var(--border)',
          cursor: interactive ? 'pointer' : 'default',
          fontSize: interactive ? '22px' : '15px'
        }}
        onClick={() => interactive && setReview(r => ({ ...r, rating: i + 1 }))}
      >★</span>
    ));
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3><Link to="/shop" className="btn btn-primary">Back to Shop</Link></div>;

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container breadcrumb__inner">
          <Link to="/">Home</Link> <FiChevronRight size={12} />
          <Link to="/shop">Shop</Link> <FiChevronRight size={12} />
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link> <FiChevronRight size={12} />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="container">
        <div className="product-layout">
          {/* Images */}
          <div className="product-images">
            <div className="product-images__main">
              <img
                src={product.images?.[activeImage] || 'https://via.placeholder.com/600x700'}
                alt={product.name}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x700?text=ShopNest'; }}
              />
              {discount && <span className="badge badge-sale product-images__badge">-{discount}%</span>}
              {product.isNew && <span className="badge badge-new product-images__badge-new">New</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="product-images__thumbs">
                {product.images.map((img, i) => (
                  <button key={i} className={`product-images__thumb ${activeImage === i ? 'active' : ''}`} onClick={() => setActiveImage(i)}>
                    <img src={img} alt={`View ${i + 1}`} onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            <div className="product-info__category">{product.category} · {product.gender}</div>
            <h1 className="product-info__name">{product.name}</h1>

            <div className="product-info__rating">
              <div className="stars">{renderStars(product.rating)}</div>
              <span>{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            <div className="product-info__price">
              <span className="product-info__current-price">PKR {product.price?.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="product-info__original-price">PKR {product.originalPrice?.toLocaleString()}</span>
              )}
              {discount && <span className="badge badge-sale">{discount}% OFF</span>}
            </div>

            <p className="product-info__description">{product.description}</p>

            <div className="divider" />

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="product-option">
                <label className="product-option__label">Color: <strong>{selectedColor}</strong></label>
                <div className="product-option__colors">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      className={`color-btn ${selectedColor === c ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="product-option">
                <label className="product-option__label">Size: <strong>{selectedSize}</strong></label>
                <div className="product-option__sizes">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="product-option">
              <label className="product-option__label">Quantity</label>
              <div className="qty-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <span className="product-stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
              >
                <FiShoppingBag size={18} />
                {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="btn btn-secondary product-actions__wish">
                <FiHeart size={18} />
              </button>
              <button className="btn btn-secondary product-actions__wish">
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="product-delivery">
              <div className="product-delivery__item">
                <FiTruck size={16} />
                <span>Free delivery on orders over PKR 5,000</span>
              </div>
              <div className="product-delivery__item">
                <FiRefreshCw size={16} />
                <span>30-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="product-tabs">
          <div className="product-tabs__nav">
            {['description', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`product-tabs__btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description' ? 'Description' : `Reviews (${product.numReviews})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="product-tabs__content">
              <p style={{ lineHeight: 1.9, color: 'var(--text-secondary)' }}>{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="product-tags">
                  {product.tags.map(t => <span key={t} className="product-tag">{t}</span>)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="product-tabs__content">
              {/* Review Form */}
              {user && (
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <h4>Write a Review</h4>
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <div className="stars" style={{ fontSize: '22px', cursor: 'pointer' }}>
                      {renderStars(review.rating, true)}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      placeholder="Share your thoughts about this product..."
                      value={review.comment}
                      onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {product.reviews?.length === 0 ? (
                <p className="text-muted" style={{ padding: '24px 0' }}>No reviews yet. Be the first to review!</p>
              ) : (
                <div className="reviews-list">
                  {product.reviews.map(r => (
                    <div key={r._id} className="review-item">
                      <div className="review-item__header">
                        <div>
                          <strong>{r.name}</strong>
                          <div className="stars" style={{ fontSize: '13px' }}>{renderStars(r.rating)}</div>
                        </div>
                        <span className="text-muted text-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
