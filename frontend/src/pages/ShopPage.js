import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import './ShopPage.css';

const CATEGORIES = ["Men's Tops", "Men's Bottoms", "Women's Tops", "Women's Bottoms", "Outerwear", "Footwear", "Accessories"];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== 1));
      const { data } = await api.get('/products', { params: { ...params, page: filters.page } });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const gender = searchParams.get('gender') || '';
    const sort = searchParams.get('sort') || 'newest';
    setFilters(f => ({ ...f, keyword, category, gender, sort, page: 1 }));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', gender: '', size: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.gender || filters.size || filters.minPrice || filters.maxPrice || filters.keyword;

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="page-header">
        <h1>{filters.keyword ? `Search: "${filters.keyword}"` : filters.category || filters.gender ? `${filters.gender} ${filters.category}`.trim() : 'All Products'}</h1>
        <p>{total} products found</p>
      </div>

      <div className="container">
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className={`shop-sidebar ${sidebarOpen ? 'shop-sidebar--open' : ''}`}>
            <div className="shop-sidebar__header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="shop-sidebar__clear" onClick={clearFilters}>Clear All</button>
              )}
              <button className="shop-sidebar__close" onClick={() => setSidebarOpen(false)}><FiX /></button>
            </div>

            {/* Search */}
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.keyword}
                onChange={e => updateFilter('keyword', e.target.value)}
                className="form-input"
              />
            </div>

            {/* Category */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-options">
                <button className={`filter-chip ${!filters.category ? 'active' : ''}`} onClick={() => updateFilter('category', '')}>All</button>
                {CATEGORIES.map(c => (
                  <button key={c} className={`filter-chip ${filters.category === c ? 'active' : ''}`} onClick={() => updateFilter('category', c)}>{c}</button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="filter-group">
              <label className="filter-label">Gender</label>
              <div className="filter-options">
                {['', 'Men', 'Women', 'Unisex'].map(g => (
                  <button key={g} className={`filter-chip ${filters.gender === g ? 'active' : ''}`} onClick={() => updateFilter('gender', g)}>
                    {g || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="filter-group">
              <label className="filter-label">Size</label>
              <div className="filter-options">
                <button className={`filter-chip ${!filters.size ? 'active' : ''}`} onClick={() => updateFilter('size', '')}>All</button>
                {SIZES.map(s => (
                  <button key={s} className={`filter-chip ${filters.size === s ? 'active' : ''}`} onClick={() => updateFilter('size', s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">Price Range (PKR)</label>
              <div className="price-range">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="form-input" />
                <span>—</span>
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="form-input" />
              </div>
            </div>
          </aside>

          {/* Products area */}
          <div className="shop-content">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <button className="btn btn-secondary btn-sm shop-filter-btn" onClick={() => setSidebarOpen(true)}>
                <FiFilter size={14} /> Filters {hasActiveFilters && <span className="filter-badge">●</span>}
              </button>
              <span className="shop-toolbar__count">{total} products</span>
              <div className="shop-sort">
                <FiChevronDown size={14} />
                <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="shop-sort__select">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-center"><div className="spinner" /><p>Loading products...</p></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`pagination__btn ${filters.page === p ? 'active' : ''}`}
                        onClick={() => setFilters(f => ({ ...f, page: p }))}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="shop-sidebar__overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default ShopPage;
