import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Check
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import SkeletonCard from '../components/SkeletonCard';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter & Query States
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [hasDiscount, setHasDiscount] = useState(searchParams.get('hasDiscount') === 'true');
  const [bestseller, setBestseller] = useState(searchParams.get('bestseller') === 'true');
  const [newArrival, setNewArrival] = useState(searchParams.get('newArrival') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Data states
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync params with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedBrand && selectedBrand !== 'All') params.set('brand', selectedBrand);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('rating', minRating);
    if (inStock) params.set('inStock', 'true');
    if (hasDiscount) params.set('hasDiscount', 'true');
    if (bestseller) params.set('bestseller', 'true');
    if (newArrival) params.set('newArrival', 'true');
    if (sort && sort !== 'popular') params.set('sort', sort);
    if (page > 1) params.set('page', page);

    setSearchParams(params, { replace: true });
  }, [keyword, selectedCategory, selectedBrand, minPrice, maxPrice, minRating, inStock, hasDiscount, bestseller, newArrival, sort, page]);

  // Fetch products
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.set('keyword', keyword);
        if (selectedCategory && selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (selectedBrand && selectedBrand !== 'All') queryParams.set('brand', selectedBrand);
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (minRating) queryParams.set('rating', minRating);
        if (inStock) queryParams.set('inStock', 'true');
        if (hasDiscount) queryParams.set('hasDiscount', 'true');
        if (bestseller) queryParams.set('bestseller', 'true');
        if (newArrival) queryParams.set('newArrival', 'true');
        if (sort) queryParams.set('sort', sort);
        queryParams.set('page', page);
        queryParams.set('limit', 12);

        const { data } = await api.get(`/products?${queryParams.toString()}`);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
        if (data.categories) setCategories(['All', ...data.categories]);
        if (data.brands) setBrands(['All', ...data.brands]);
      } catch (err) {
        console.error('Error fetching catalog:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [keyword, selectedCategory, selectedBrand, minPrice, maxPrice, minRating, inStock, hasDiscount, bestseller, newArrival, sort, page]);

  const clearAllFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setInStock(false);
    setHasDiscount(false);
    setBestseller(false);
    setNewArrival(false);
    setSort('popular');
    setPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedBrand !== 'All' ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (minRating ? 1 : 0) +
    (inStock ? 1 : 0) +
    (hasDiscount ? 1 : 0) +
    (bestseller ? 1 : 0) +
    (newArrival ? 1 : 0) +
    (keyword ? 1 : 0);

  const filterSidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header with clear */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={18} color="var(--primary-rose)" /> Filters
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary-rose)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Reset All
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
          Categories
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedCategory === cat ? 'var(--primary-rose-light)' : 'transparent',
                color: selectedCategory === cat ? 'var(--primary-rose)' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.88rem'
              }}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
          Price Range ($)
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="form-input"
            style={{ padding: '0.5rem 0.7rem', fontSize: '0.85rem' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="form-input"
            style={{ padding: '0.5rem 0.7rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
          Minimum Rating
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => {
                setMinRating(minRating === String(stars) ? '' : String(stars));
                setPage(1);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: minRating === String(stars) ? 'var(--primary-rose-light)' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: minRating === String(stars) ? 'var(--primary-rose)' : 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < stars ? '#D4AF37' : 'none'}
                    stroke="#D4AF37"
                  />
                ))}
              </div>
              <span>{stars} Stars & Above</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Status Toggles */}
      <div>
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
          Preferences
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => {
                setInStock(e.target.checked);
                setPage(1);
              }}
            />
            <span>In Stock Only</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={hasDiscount}
              onChange={(e) => {
                setHasDiscount(e.target.checked);
                setPage(1);
              }}
            />
            <span>Special Promotional Offers</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={newArrival}
              onChange={(e) => {
                setNewArrival(e.target.checked);
                setPage(1);
              }}
            />
            <span>New Formulations</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={bestseller}
              onChange={(e) => {
                setBestseller(e.target.checked);
                setPage(1);
              }}
            />
            <span>Bestsellers</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Page Title & Search Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">The Complete Collection</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)', marginBottom: '0.5rem' }}>
            Atelier Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px' }}>
            Explore biocompatible botanical skincare, weightless pigments, and artisan-blended luxury rituals.
          </p>
        </div>

        {/* Top Controls Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'var(--bg-surface)',
          padding: '1rem 1.4rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Search input in catalog */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '420px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search formulations, ingredients, brands..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '2rem', height: '42px', fontSize: '0.88rem' }}
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="btn btn-outline btn-sm mobile-filter-btn"
              style={{ display: 'none' }}
            >
              <Filter size={16} /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* Total Results Count */}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {products.length} of {totalCount} items
            </span>

            {/* Sorting Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="form-select"
                style={{ height: '42px', padding: '0.3rem 2rem 0.3rem 0.85rem', fontSize: '0.88rem', width: 'auto' }}
              >
                <option value="popular">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Catalog Layout: Sidebar + Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }} className="shop-layout">
          
          {/* Desktop Filter Sidebar */}
          <aside className="desktop-filters" style={{
            background: 'var(--bg-surface)',
            padding: '1.8rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {filterSidebar}
          </aside>

          {/* Products Grid Area */}
          <main>
            {loading ? (
              <div className="grid-products">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid-products">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '4rem' }}>
                    {[...Array(totalPages)].map((_, idx) => {
                      const pNum = idx + 1;
                      const active = pNum === page;
                      return (
                        <button
                          key={pNum}
                          onClick={() => {
                            setPage(pNum);
                            window.scrollTo({ top: 180, behavior: 'smooth' });
                          }}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            border: active ? 'none' : '1px solid var(--border-light)',
                            background: active ? 'var(--primary-rose)' : 'var(--bg-surface)',
                            color: active ? '#FFFFFF' : 'var(--text-primary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No formulations match your search</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                  Try adjusting your filters, selecting a different category, or resetting your price criteria.
                </p>
                <button onClick={clearAllFilters} className="btn btn-rose">
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(26, 23, 21, 0.5)',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '85%',
            maxWidth: '360px',
            background: 'var(--bg-surface)',
            padding: '1.8rem',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Filter Products</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>
            {filterSidebar}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '2rem' }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Responsive layout CSS */}
      <style>{`
        @media (max-width: 900px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-filters {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;
