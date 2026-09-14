import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Leaf, Award, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        
        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-subtitle">Our Heritage</span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.4rem)', marginBottom: '1.5rem' }}>
            The Architecture of Timeless Radiance
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '720px', margin: '0 auto' }}>
            Born from the intersection of botanical alchemy and high-performance dermatological science, ÉLORA BEAUTY redefines cosmetic luxury.
          </p>
        </div>

        {/* Hero image banner */}
        <div style={{
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
            alt="Élora beauty clean cosmetic atelier"
            style={{ width: '100%', height: '460px', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Brand Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
            <div style={{ background: 'var(--primary-rose-light)', color: 'var(--primary-rose)', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <Leaf size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.8rem' }}>100% Clean Actives</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem' }}>
              Every tincture is harvested with conscious ethical stewardship. We extract pure antioxidant cold-pressed botanicals without sulfates, parabens, or micro-plastics.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
            <div style={{ background: 'var(--champagne-light)', color: 'var(--champagne-gold)', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.8rem' }}>Clinical Efficacy</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem' }}>
              We formulate with biomimetic multi-weight peptides, encapsulated retinoids, and ethylated vitamin C at verified concentrations for real, visible rejuvenation.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
            <div style={{ background: '#F0FDF4', color: 'var(--color-success)', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <Heart size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.8rem' }}>Sensory Artistry</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem' }}>
              Skincare should never be a chore; it is an intimate daily celebration. Our textures melt like chilled silk and carry delicate natural notes of Grasse roses.
            </p>
          </div>
        </div>

        {/* Founder note */}
        <div style={{
          background: '#FAF7F4',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem',
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--text-primary)', lineHeight: 1.8, display: 'block', maxWidth: '680px', margin: '0 auto 2rem auto' }}>
            "We created Élora because beauty shouldn't be about masking identity—it should feel like you, elevated to your most confident, luminous expression."
          </span>
          <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>The Élora Botanical Collective</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>New York & Paris</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/shop" className="btn btn-rose btn-lg">
            Explore Our Formulations <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
