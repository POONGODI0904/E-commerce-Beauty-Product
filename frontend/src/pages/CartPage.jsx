import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  X,
  Truck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const {
    cartItems,
    itemsCount,
    subtotal,
    freeShippingThreshold,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    coupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch {
      // Error handled by CartContext via Toast
    } finally {
      setCouponLoading(false);
    }
  };

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '65vh' }}>
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
          <ShoppingBag size={38} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Your Shopping Bag is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
          Explore our collection of clinical botanicals, antioxidant serums, and couture lipsticks to start your ritual.
        </p>
        <Link to="/shop" className="btn btn-rose btn-lg">
          Discover The Atelier <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Page Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Shopping Bag</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)' }}>
            Your Curated Selections ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.2rem 1.6rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <Truck size={18} color="var(--primary-rose)" />
              {amountToFreeShipping > 0
                ? `Add $${amountToFreeShipping.toFixed(2)} more to unlock Complimentary Royal Shipping`
                : '🎉 You have unlocked Complimentary Royal Shipping!'}
            </span>
            <span style={{ fontWeight: 600, color: 'var(--primary-rose)' }}>
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div style={{ height: '7px', background: '#F0ECE8', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #C5897A 0%, #D4AF37 100%)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Main Grid: Bag Items + Order Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          
          {/* Left Column: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  padding: '1.4rem',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Thumbnail */}
                <Link to={`/product/${item.product}`} style={{ flexShrink: 0 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                </Link>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-rose)', fontWeight: 600 }}>
                    {item.category}
                  </div>
                  <Link
                    to={`/product/${item.product}`}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      display: 'block',
                      margin: '0.2rem 0 0.5rem 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.name}
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      ${item.discountPrice.toFixed(2)}
                    </span>
                    {item.discount > 0 && (
                      <span style={{ fontSize: '0.82rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', background: '#FAF8F5' }}>
                  <button
                    onClick={() => updateQuantity(item.product, item.qty - 1)}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem' }}
                  >
                    -
                  </button>
                  <span style={{ width: '30px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.qty + 1)}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem' }}
                  >
                    +
                  </button>
                </div>

                {/* Total Line Item Price */}
                <div style={{ fontWeight: 600, fontSize: '1.1rem', minWidth: '70px', textAlign: 'right' }}>
                  ${(item.discountPrice * item.qty).toFixed(2)}
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  aria-label="Remove item"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <Link to="/shop" style={{ fontSize: '0.88rem', color: 'var(--primary-rose)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear Bag
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            padding: '2.2rem',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '110px'
          }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              Order Summary
            </h3>

            {/* Promo Coupon Form */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Promotional Code
              </label>

              {coupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--primary-rose-light)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-rose)', fontWeight: 600, fontSize: '0.88rem' }}>
                    <Tag size={16} /> {coupon.code} (-${discountAmount.toFixed(2)})
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-rose)' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. GLOW20 or BEAUTY10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="form-input"
                    style={{ textTransform: 'uppercase', fontSize: '0.88rem', padding: '0.6rem 0.9rem' }}
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="btn btn-outline btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Calculation Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.94rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-rose)' }}>
                  <span>Discount Applied ({coupon?.code})</span>
                  <span style={{ fontWeight: 600 }}>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span>{shippingPrice === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `$${shippingPrice.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (8%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>Grand Total</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-rose btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--color-success)" />
              Guaranteed 256-Bit SSL Encrypted Checkout
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
