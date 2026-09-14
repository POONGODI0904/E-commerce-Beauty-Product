import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Star, Heart, ShoppingBag, Check, Shield, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'];

  const discountPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  const isSaved = isInWishlist(product._id);

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <X size={18} />
        </button>

        {/* Left Column: Image Gallery */}
        <div style={{ padding: '2rem', background: '#FAF7F4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', height: '340px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#FFFFFF' }}>
            <img
              src={images[selectedImgIndex] || images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {product.discount > 0 && (
              <span className="badge badge-sale" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                -{product.discount}%
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedImgIndex === idx ? '2px solid var(--primary-rose)' : '1px solid var(--border-light)',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.76rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary-rose)', fontWeight: 600 }}>
            {product.brand} • {product.category}
          </span>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', lineHeight: 1.25, marginTop: '0.3rem', marginBottom: '0.6rem' }}>
            {product.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', color: '#D4AF37' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < Math.floor(product.rating || 5) ? '#D4AF37' : 'none'}
                  stroke="#D4AF37"
                />
              ))}
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{product.rating || '5.0'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({product.numReviews || 1} reviews)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', marginBottom: '1.2rem' }}>
            {discountPrice ? (
              <>
                <span style={{ fontSize: '1.55rem', fontWeight: 600, color: 'var(--primary-rose)' }}>
                  ${discountPrice}
                </span>
                <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span style={{ fontSize: '1.55rem', fontWeight: 600 }}>
                ${product.price.toFixed(2)}
              </span>
            )}
            <span style={{ fontSize: '0.78rem', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600, marginLeft: 'auto' }}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          {/* Skin Type & Benefits snippet */}
          <div style={{ background: '#F8F5F2', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
            <div><strong>Skin Ritual:</strong> {product.skinType || 'All Skin Types'}</div>
            {product.benefits && product.benefits.length > 0 && (
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Key benefit: {product.benefits[0]}
              </div>
            )}
          </div>

          {/* Quantity & Actions */}
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', background: '#FFFFFF' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                -
              </button>
              <span style={{ width: '32px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="btn btn-rose"
              style={{ flex: 1, padding: '0.75rem 1.2rem', fontSize: '0.85rem' }}
            >
              <ShoppingBag size={16} /> Add to Bag
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid var(--border-light)',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Heart size={18} fill={isSaved ? '#BE123C' : 'transparent'} color={isSaved ? '#BE123C' : '#1F1B18'} />
            </button>
          </div>

          {/* Direct Buy Now & View Details link */}
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto' }}>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.75rem 1.2rem', fontSize: '0.85rem' }}
            >
              Instant Checkout
            </button>

            <Link
              to={`/product/${product._id}`}
              onClick={onClose}
              className="btn btn-outline"
              style={{ padding: '0.75rem 1.2rem', fontSize: '0.85rem' }}
            >
              Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
