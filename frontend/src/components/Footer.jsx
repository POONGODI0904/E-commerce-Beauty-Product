import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, HeartHandshake } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success, error } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    success('Thank you for subscribing! Check your inbox for your 15% welcome code.');
    setEmail('');
  };

  return (
    <footer style={{
      backgroundColor: '#181412',
      color: '#ECE6DF',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      borderTop: '1px solid #2D2723',
      position: 'relative'
    }}>
      {/* Brand Value Pillars */}
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        paddingBottom: '3.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'rgba(197, 137, 122, 0.15)',
            color: 'var(--primary-rose)',
            padding: '0.8rem',
            borderRadius: '50%'
          }}>
            <Truck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFFFFF' }}>Complimentary Shipping</div>
            <div style={{ fontSize: '0.82rem', color: '#A0978F' }}>On all domestic orders over $50</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'rgba(197, 137, 122, 0.15)',
            color: 'var(--primary-rose)',
            padding: '0.8rem',
            borderRadius: '50%'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFFFFF' }}>100% Clean & Certified</div>
            <div style={{ fontSize: '0.82rem', color: '#A0978F' }}>Cruelty-free botanical formulas</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'rgba(197, 137, 122, 0.15)',
            color: 'var(--primary-rose)',
            padding: '0.8rem',
            borderRadius: '50%'
          }}>
            <RefreshCw size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFFFFF' }}>Complimentary Returns</div>
            <div style={{ fontSize: '0.82rem', color: '#A0978F' }}>30-day effortless satisfaction promise</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'rgba(197, 137, 122, 0.15)',
            color: 'var(--primary-rose)',
            padding: '0.8rem',
            borderRadius: '50%'
          }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFFFFF' }}>Bespoke Concierge</div>
            <div style={{ fontSize: '0.82rem', color: '#A0978F' }}>Expert skincare consultation 24/7</div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem'
      }}>
        {/* Brand Info & Newsletter */}
        <div style={{ gridColumn: 'span 2' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, letterSpacing: '0.12em', color: '#FFFFFF' }}>
            ÉLORA
          </span>
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--primary-rose)', display: 'block', marginTop: '2px', marginBottom: '1.2rem' }}>
            BEAUTY
          </span>
          <p style={{ color: '#A0978F', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: '380px', marginBottom: '1.8rem' }}>
            Elevating your self-care rituals through biocompatible clean botanicals, clinical actives, and sensory luxury that honours your skin's natural architecture.
          </p>

          <form onSubmit={handleSubscribe} style={{ maxWidth: '380px' }}>
            <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', display: 'block', marginBottom: '0.5rem' }}>
              Join the Élora Circle
            </label>
            <div style={{ display: 'flex', position: 'relative' }}>
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '0.85rem 3rem 0.85rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  width: '38px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--primary-rose)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <ArrowRight size={18} />
              </button>
            </div>
            {subscribed && (
              <span style={{ fontSize: '0.78rem', color: '#86EFAC', display: 'block', marginTop: '0.4rem' }}>
                ✓ You are enrolled in our private fragrance & skincare previews.
              </span>
            )}
          </form>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            Collections
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#A0978F' }}>
            <li><Link to="/shop?category=Skincare" style={{ color: 'inherit' }}>Antioxidant Skincare</Link></li>
            <li><Link to="/shop?category=Makeup" style={{ color: 'inherit' }}>Velvet Silk Makeup</Link></li>
            <li><Link to="/shop?category=Haircare" style={{ color: 'inherit' }}>Botanical Hair Care</Link></li>
            <li><Link to="/shop?category=Body Care" style={{ color: 'inherit' }}>Nourishing Body Care</Link></li>
            <li><Link to="/shop?category=Fragrance" style={{ color: 'inherit' }}>Haute Perfumery</Link></li>
            <li><Link to="/shop?category=Beauty Kits" style={{ color: 'inherit' }}>Gift Sets & Ritual Kits</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            Client Care
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#A0978F' }}>
            <li><Link to="/dashboard?tab=orders" style={{ color: 'inherit' }}>Track Your Order</Link></li>
            <li><Link to="/dashboard" style={{ color: 'inherit' }}>Client Profile</Link></li>
            <li><Link to="/cart" style={{ color: 'inherit' }}>Shopping Bag</Link></li>
            <li><Link to="/wishlist" style={{ color: 'inherit' }}>Saved Wishlist</Link></li>
            <li><Link to="/contact" style={{ color: 'inherit' }}>Bespoke Consultation</Link></li>
            <li><Link to="/about" style={{ color: 'inherit' }}>Our Atelier Philosophy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            The Atelier
          </h4>
          <p style={{ color: '#A0978F', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            575 Fifth Avenue, Suite 900<br />
            New York, NY 10017<br />
            concierge@elora.com<br />
            +1 (555) 019-2831
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-rose)' }}>
            Monday – Friday: 9am – 6pm EST
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        fontSize: '0.8rem',
        color: '#7D756F'
      }}>
        <div>
          © {new Date().getFullYear()} ÉLORA BEAUTY. All rights reserved. Crafted for exquisite beauty rituals.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }}>Dermatological Safety</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
