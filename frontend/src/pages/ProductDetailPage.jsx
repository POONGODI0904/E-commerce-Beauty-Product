import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Share2,
  Check
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setRelated(data.related || []);
        setSelectedImage(0);

        // Fetch reviews
        const reviewRes = await api.get(`/reviews/product/${id}`);
        setReviews(reviewRes.data || []);
      } catch (err) {
        toastError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toastError('Please sign in to submit a verified review');
      navigate('/auth');
      return;
    }

    if (!newComment.trim()) {
      toastError('Please enter your review feedback');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        productId: id,
        rating: newRating,
        comment: newComment
      });
      success('Thank you for sharing your review!');
      setNewComment('');
      // Reload reviews & product rating
      const reviewRes = await api.get(`/reviews/product/${id}`);
      setReviews(reviewRes.data || []);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      toastError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-rose)' }}>
          Curating atelier product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-rose" style={{ marginTop: '1.5rem' }}>
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'];

  const isSaved = isInWishlist(product._id);
  const discountPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <div style={{ padding: '2.5rem 0 6rem 0' }}>
      <div className="container">
        
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'inherit' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" style={{ color: 'inherit' }}>Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: 'inherit' }}>
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
          marginBottom: '5rem'
        }}>
          
          {/* Left Column: Multi-Image Showcase */}
          <div>
            {/* Primary Large Image */}
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)',
              aspectRatio: '1/1',
              marginBottom: '1rem'
            }}>
              <img
                src={images[selectedImage]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {product.discount > 0 && (
                <span className="badge badge-sale" style={{ position: 'absolute', top: '16px', left: '16px', padding: '0.4rem 0.8rem' }}>
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid var(--primary-rose)' : '1px solid var(--border-light)',
                      padding: 0,
                      cursor: 'pointer',
                      background: '#FFFFFF'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--primary-rose)', fontWeight: 600 }}>
                {product.brand}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  success('Link copied to clipboard!');
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}
              >
                <Share2 size={15} /> Share
              </button>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', lineHeight: 1.2, marginBottom: '0.8rem' }}>
              {product.name}
            </h1>

            {/* Rating and Reviews Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating || 5) ? '#D4AF37' : 'none'}
                    stroke="#D4AF37"
                  />
                ))}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{product.rating || '5.0'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                ({reviews.length || product.numReviews || 1} verified client reviews)
              </span>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
              {discountPrice ? (
                <>
                  <span style={{ fontSize: '2.2rem', fontWeight: 600, color: 'var(--primary-rose)' }}>
                    ${discountPrice}
                  </span>
                  <span style={{ fontSize: '1.3rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="badge badge-gold" style={{ fontSize: '0.78rem' }}>
                    Save ${(product.price - discountPrice).toFixed(2)}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '2.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.8rem' }}>
              {product.description}
            </p>

            {/* Key Specs Card */}
            <div style={{ background: '#F8F5F2', borderRadius: 'var(--radius-md)', padding: '1.2rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.86rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ideal For</span>
                <strong>{product.skinType || 'All Skin Types'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stock Status</span>
                <strong style={{ color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Temporarily Out of Stock'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Item SKU</span>
                <strong>{product.sku || 'ELR-CLASSIC'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Formulation</span>
                <strong>100% Clean & Biocompatible</strong>
              </div>
            </div>

            {/* Quantity Stepper & Buttons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', background: '#FFFFFF', padding: '0.2rem' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '42px', height: '42px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  -
                </button>
                <span style={{ width: '36px', textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  style={{ width: '42px', height: '42px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className="btn btn-rose btn-lg"
                style={{ flex: 1 }}
              >
                <ShoppingBag size={18} /> Add to Bag
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-light)',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Heart size={22} fill={isSaved ? '#BE123C' : 'transparent'} color={isSaved ? '#BE123C' : '#1F1B18'} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={() => {
                addToCart(product, quantity);
                navigate('/checkout');
              }}
              disabled={product.stock <= 0}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '2.5rem' }}
            >
              <Zap size={18} /> Instant Buy Now
            </button>

            {/* Shipping & Assurance Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Truck size={20} color="var(--primary-rose)" />
                <span>Complimentary Shipping Over $50</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <RotateCcw size={20} color="var(--primary-rose)" />
                <span>30-Day Effortless Returns</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={20} color="var(--primary-rose)" />
                <span>Dermatologically Certified</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabs Section: Description, Ingredients, How To Use, Reviews */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          marginBottom: '6rem'
        }}>
          {/* Tabs Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', overflowX: 'auto' }}>
            {[
              { id: 'description', label: 'Description & Benefits' },
              { id: 'ingredients', label: 'Clean Ingredients' },
              { id: 'howtouse', label: 'The Application Ritual' },
              { id: 'reviews', label: `Client Reviews (${reviews.length})` }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '1.2rem 2rem',
                    border: 'none',
                    background: active ? '#FFFFFF' : '#FAF8F5',
                    color: active ? 'var(--primary-rose)' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    borderBottom: active ? '2px solid var(--primary-rose)' : 'none',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Description & Benefits */}
          {activeTab === 'description' && (
            <div style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Formulation Philosophy</h3>
              <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {product.description}
              </p>

              {product.benefits && product.benefits.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Proven Skin Benefits</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {product.benefits.map((benefit, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#FAF7F4', padding: '0.85rem 1.2rem', borderRadius: '10px' }}>
                        <Sparkles size={16} color="var(--primary-rose)" />
                        <span style={{ fontSize: '0.92rem' }}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Full Ingredient Transparency</h3>
              <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1.5rem', fontFamily: 'monospace', background: '#F8F5F2', padding: '1.5rem', borderRadius: '12px', fontSize: '0.92rem' }}>
                {product.ingredients || 'Aqua, Organic Aloe Barbadensis, Botanical Actives, Glycerin, Rosa Damascena Extract.'}
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                * 100% Free of parabens, synthetic sulfates (SLS/SLES), mineral oils, phthalates, and formaldehyde-releasing agents.
              </div>
            </div>
          )}

          {/* Tab 3: How to Use */}
          {activeTab === 'howtouse' && (
            <div style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>The Application Ritual</h3>
              <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                {product.usage || 'Apply gently onto clean skin morning and evening. Pat gently with fingertips until fully absorbed.'}
              </p>
              <div style={{ background: 'var(--primary-rose-light)', padding: '1.2rem 1.5rem', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                <strong>Atelier Pro Tip:</strong> For maximum absorption, apply immediately after misting with our Rose & Peptide Mist Toner while skin remains dewy.
              </div>
            </div>
          )}

          {/* Tab 4: Reviews & Add Review Form */}
          {activeTab === 'reviews' && (
            <div style={{ padding: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                
                {/* Review Submissions List */}
                <div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
                    Verified Client Reviews ({reviews.length})
                  </h3>

                  {reviews.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {reviews.map((rev) => (
                        <div key={rev._id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <img
                              src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                              alt=""
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rev.userName}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Check size={12} /> Verified Buyer
                              </div>
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', color: '#D4AF37' }}>
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="#D4AF37" stroke="#D4AF37" />
                              ))}
                            </div>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>Be the first to share your experience with this formulation.</p>
                  )}
                </div>

                {/* Add Review Form */}
                <div style={{ background: '#FAF7F4', padding: '2rem', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Write a Review</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Share your thoughts on formulation texture, efficacy, and results.
                  </p>

                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                          >
                            <Star
                              size={24}
                              fill={star <= newRating ? '#D4AF37' : 'none'}
                              stroke="#D4AF37"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Experience</label>
                      <textarea
                        rows={4}
                        placeholder="How did this product feel on your skin? What results did you notice?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="form-textarea"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn btn-rose"
                      style={{ width: '100%' }}
                    >
                      {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Related Products Carousel / Grid */}
        {related.length > 0 && (
          <div>
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
              <span className="section-subtitle">Complementary Rituals</span>
              <h2 className="section-title">You May Also Adore</h2>
            </div>
            <div className="grid-products">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;
