import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const isSaved = isInWishlist(product._id);
  const discountPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product, 1);
    setTimeout(() => setAdding(false), 500);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const mainImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80';

  const secondaryImage = Array.isArray(product.images) && product.images.length > 1
    ? product.images[1]
    : mainImage;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
      }}
    >
      {/* Badges Container */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {product.newArrival && (
          <span className="badge badge-new" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>
            NEW
          </span>
        )}
        {product.discount > 0 && (
          <span className="badge badge-sale" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>
            -{product.discount}%
          </span>
        )}
        {product.bestseller && (
          <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>
            BESTSELLER
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistClick}
        aria-label="Toggle Wishlist"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(8px)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.2s ease',
          transform: isSaved ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <Heart
          size={18}
          style={{
            fill: isSaved ? '#BE123C' : 'transparent',
            color: isSaved ? '#BE123C' : '#5E5854',
            transition: 'fill 0.2s ease, color 0.2s ease'
          }}
        />
      </button>

      {/* Product Image Stage */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', background: '#F8F5F2' }}>
        <Link to={`/product/${product._id}`}>
          <img
            src={isHovered ? secondaryImage : mainImage}
            alt={product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)'
            }}
          />
        </Link>

        {/* Quick View Button on Hover */}
        <button
          onClick={handleQuickViewClick}
          aria-label="Quick preview"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: isHovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
            opacity: isHovered ? 1 : 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 0.95rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap'
          }}
        >
          <Eye size={14} /> Quick View
        </button>
      </div>

      {/* Details Container */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500 }}>
            {product.category}
          </span>
          {/* Star Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.76rem', color: '#D4AF37', fontWeight: 600 }}>
            <Star size={13} fill="#D4AF37" />
            <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({product.numReviews || 1})</span>
          </div>
        </div>

        {/* Name */}
        <Link
          to={`/product/${product._id}`}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.35,
            marginBottom: '0.4rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7rem'
          }}
        >
          {product.name}
        </Link>

        {/* Skin Type Subtitle */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
          {product.skinType || 'All Skin Types'}
        </div>

        {/* Price Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: 'auto', marginBottom: '1.1rem' }}>
          {discountPrice ? (
            <>
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-rose)' }}>
                ${discountPrice}
              </span>
              <span style={{ fontSize: '0.88rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Buttons: Add to Bag & Buy Now */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="btn btn-rose btn-sm"
            style={{
              padding: '0.55rem 0.8rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <ShoppingBag size={14} />
            {product.stock <= 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Bag'}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="btn btn-primary btn-sm"
            title="Instant Checkout"
            style={{
              padding: '0.55rem 0.8rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Zap size={14} /> Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
