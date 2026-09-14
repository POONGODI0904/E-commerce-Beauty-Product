import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlist, moveToCart, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1rem' }}>
          <div>
            <span className="section-subtitle">Private Curation</span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)' }}>
              Saved In Your Wishlist ({wishlist.length})
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Formulations and rituals you have reserved for your upcoming self-care vanity.
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="btn btn-rose"
            >
              <ShoppingBag size={16} /> Move All to Bag
            </button>
          )}
        </div>

        {wishlist.length > 0 ? (
          <div className="grid-products">
            {wishlist.map((item) => (
              <ProductCard
                key={item._id || item}
                product={item}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '6rem 2rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary-rose-light)',
              color: 'var(--primary-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Heart size={36} />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>Your Wishlist is Empty</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
              Explore our boutique catalog and tap the heart icon on any formulation to save it here for later.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Explore Formulations <ArrowRight size={18} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
