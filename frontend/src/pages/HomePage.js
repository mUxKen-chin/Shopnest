import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [f, n] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/new-arrivals'),
        ]);
        setFeatured(f.data);
        setNewArrivals(n.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const categories = [
    { name: "Men's Fashion", slug: "Men's Tops", img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600', gender: 'Men' },
    { name: "Women's Fashion", slug: "Women's Tops", img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', gender: 'Women' },
    { name: 'Outerwear', slug: 'Outerwear', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', category: 'Outerwear' },
    { name: 'Accessories', slug: 'Accessories', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', category: 'Accessories' },
  ];

  return (
    <div className="homepage">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400')" }} />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <span className="hero__label">New Collection 2024</span>
          <h1 className="hero__title">Dress to<br /><em>Impress</em></h1>
          <p className="hero__subtitle">Discover premium fashion pieces that define your style. Curated collections for the modern individual.</p>
          <div className="hero__actions">
            <Link to="/shop" className="btn btn-gold btn-lg">Shop Now</Link>
            <Link to="/shop?isNew=true" className="btn btn-secondary btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features section-sm">
        <div className="container features__grid">
          {[
            { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over PKR 5,000' },
            { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: <FiShield />, title: 'Secure Payment', desc: '100% secure transactions' },
            { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Dedicated customer service' },
          ].map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-item__icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find your perfect style</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={cat.gender ? `/shop?gender=${cat.gender}` : `/shop?category=${cat.category}`}
                className="category-card"
              >
                <img src={cat.img} alt={cat.name} className="category-card__img"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=' + cat.name; }} />
                <div className="category-card__overlay">
                  <h3>{cat.name}</h3>
                  <span>Shop Now <FiArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop" className="section-link">View All <FiArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="banner-section">
        <div className="banner-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400')" }} />
        <div className="banner-overlay" />
        <div className="container banner-content">
          <span className="hero__label">Limited Time Offer</span>
          <h2>Up to 30% Off<br />Selected Items</h2>
          <p>Don't miss out on our seasonal sale. Shop the latest trends at unbeatable prices.</p>
          <Link to="/shop?sort=price_asc" className="btn btn-gold btn-lg">Shop the Sale</Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/shop?isNew=true" className="section-link">View All <FiArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
