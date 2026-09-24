import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Star,
  Flame,
  Award,
  Clock,
  Heart,
  Eye,
  CheckCircle
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import CountdownTimer from '../components/CountdownTimer';
import SkeletonCard from '../components/SkeletonCard';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, trendRes, bestRes, newRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=8&featured=true'),
          api.get('/products?limit=8&bestseller=true'),
          api.get('/products?limit=8&newArrival=true')
        ]);

        setCategories(catRes.data.categories || catRes.data.data || catRes.data || []);
setTrendingProducts(trendRes.data.products || trendRes.data.data || trendRes.data || []);
setBestsellers(bestRes.data.products || bestRes.data.data || bestRes.data || []);
setNewArrivals(newRes.data.products || newRes.data.data || newRes.data || []);
      } catch (err) {
        console.error('Failed to load home page content:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const editorialRoutines = [
    {
      title: 'The Dewy Glass Skincare Routine',
      subtitle: '4-Step Botanical Radiance',
      desc: 'Formulated with multi-weight hyaluronic acid, 15% ethylated vitamin C, and damask rose water to lock in 72-hour moisture.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Skincare'
    },
    {
      title: 'Couture Velvet Makeup Essentials',
      subtitle: 'Weightless Luminous Veils',
      desc: 'Second-skin serums, buildable camellia lipsticks, and crease-proof caffeine concealers for red-carpet radiance.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Makeup'
    },
    {
      title: 'Botanical Hair Sanctuary Ritual',
      subtitle: 'Cold-Pressed Marula & Keratin',
      desc: 'Restores heat-damaged hair cuticles and seals flyaways with featherlight botanical oils and plant stem cells.',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Haircare'
    },
    {
      title: 'Sensuous Midnight Fragrance & Body',
      subtitle: 'Haute French Perfumery',
      desc: 'Damascan rose petals, warm amber resin, and wild Madagascar vanilla formulated into luxurious scents and whipped soufflés.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Fragrance'
    }
  ];

  const customerTestimonials = [
    {
      name: 'Genevieve Dupré',
      role: 'Fashion & Beauty Director, Paris',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      productPurchased: 'Luminous 15% Vitamin C + Ferulic Serum',
      review: 'Élora Beauty has completely replaced my entire luxury skincare vanity. The Vitamin C serum gave me radiant, glass-like clarity in under two weeks with zero sensitivity. Simply sublime.'
    },
    {
      name: 'Camilla Vance',
      role: 'Celebrity Makeup Artist, NYC',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      productPurchased: 'Silk Veil Luminous Serum Foundation',
      review: 'The texture of the Silk Veil foundation is peerless. It melts seamlessly into the skin like a second layer of cashmere, reflecting soft candlelight without ever looking made up.'
    },
    {
      name: 'Eleanor Sterling',
      role: 'Dermatology Consultant, London',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      productPurchased: 'Ceramide Barrier Recovery Silk Cream',
      review: 'A magnificent formulation that respects the epidermal barrier. High concentrations of 5 biomimetic ceramides without heavy silicones. My skin has never felt more protected and calmed.'
    }
  ];

  return (
    <div className="homepage-wrapper">
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at 80% 30%, #F5EAE4 0%, #FAF8F5 65%, #F4EDE7 100%)',
        padding: '5rem 0 6rem 0',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(197, 137, 122, 0.14)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '4rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Hero Left Content */}
          <div className="animate-slide-up" style={{ maxWidth: '580px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(197, 137, 122, 0.3)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <Sparkles size={16} color="var(--primary-rose)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary-rose)' }}>
                Haute Beauty & Clinical Botanicals
              </span>
            </div>

            <h1 style={{ marginBottom: '1.4rem', fontWeight: 500, lineHeight: 1.12 }}>
              Beauty That Feels <br />
              <span style={{ fontStyle: 'italic', color: 'var(--primary-rose)' }}>Like You</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Formulated without compromise. Discover sensory skincare rituals, breathable silk makeup, and artisanal fragrances designed to celebrate your timeless radiance.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link to="/shop" className="btn btn-rose btn-lg">
                Shop The Atelier <ArrowRight size={18} />
              </Link>
              <Link to="/shop?bestseller=true" className="btn btn-outline btn-lg">
                Explore Best Sellers
              </Link>
            </div>

            {/* Micro Highlights */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3.5rem', borderTop: '1px solid rgba(226, 217, 209, 0.8)', paddingTop: '1.8rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  Biocompatible
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  35+
                </div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  Luxury Formulas
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  4.9★
                </div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  Client Acclaim
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right Media with Floating Badges */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(31, 27, 24, 0.12)',
              border: '6px solid #FFFFFF'
            }}>
              <img
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80"
                alt="Élora Beauty Luxury Product"
                style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Floating Luxury Badge 1 */}
            <div
              className="glass-card animate-float"
              style={{
                position: 'absolute',
                top: '12%',
                left: '-10%',
                padding: '1rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                borderRadius: '16px'
              }}
            >
              <div style={{ background: 'var(--primary-rose-light)', color: 'var(--primary-rose)', padding: '0.6rem', borderRadius: '50%' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pure French Rosehip</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cold-Pressed Active Infusion</div>
              </div>
            </div>

            {/* Floating Luxury Badge 2 */}
            <div
              className="glass-card animate-float"
              style={{
                position: 'absolute',
                bottom: '10%',
                right: '-5%',
                padding: '1rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                borderRadius: '16px',
                animationDelay: '1.5s'
              }}
            >
              <div style={{ background: '#F0FDF4', color: 'var(--color-success)', padding: '0.6rem', borderRadius: '50%' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cruelty-Free & Vegan</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PETA & Leaping Bunny Certified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section id="categories" style={{ padding: '6rem 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Curated Offerings</span>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-desc">
              Discover clean botanical skincare, velvet cosmetics, hair rituals, and haute fragrance.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((category) => (
              <Link
                key={category._id || category.slug}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.4s ease',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem'
                }}
                className="category-card"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                  className="cat-img"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(24, 20, 18, 0.85) 0%, rgba(24, 20, 18, 0.2) 60%, transparent 100%)'
                }} />

                <div style={{ position: 'relative', zIndex: 2, color: '#FFFFFF' }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: '0.2rem' }}>
                    {category.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#E8DECF', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>{category.itemCount || 6} Formulations</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-subtitle">Trending Now</span>
              <h2 className="section-title" style={{ marginBottom: '0.3rem' }}>Beloved by the Atelier</h2>
              <p className="section-desc">Our most coveted formulations, coveted for transformative efficacy.</p>
            </div>
            <Link to="/shop" className="btn btn-outline">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-products">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
              : trendingProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* 4. SPECIAL OFFERS: "GLOW MORE, SPEND LESS" COUNTDOWN SECTION */}
      <section style={{
        padding: '5.5rem 0',
        background: 'linear-gradient(135deg, #2D2421 0%, #1A1715 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(197, 137, 122, 0.15)',
          filter: 'blur(90px)'
        }} />

        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '3.5rem',
          position: 'relative',
          zIndex: 2
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--champagne-gold)', fontSize: '0.82rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
              <Flame size={18} /> Limited Private Boutique Offer
            </div>

            <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.15, marginBottom: '1.2rem' }}>
              Glow More, <br />
              <span style={{ color: 'var(--primary-rose)', fontStyle: 'italic' }}>Spend Less</span>
            </h2>

            <p style={{ color: '#C8BEB7', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>
              Immerse yourself in our premier antioxidant elixirs and silk creams. Enjoy an exclusive 20% savings on qualifying orders before the countdown expires.
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A0978F', marginBottom: '0.6rem' }}>
                Offer Expires In:
              </div>
              <CountdownTimer />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/shop?hasDiscount=true" className="btn btn-rose btn-lg">
                Claim 20% Off With GLOW20
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              border: '4px solid rgba(255, 255, 255, 0.15)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                alt="Luxury beauty offer collection"
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS CAROUSEL / SLIDER */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-subtitle">Hall of Fame</span>
              <h2 className="section-title" style={{ marginBottom: '0.3rem' }}>Best-Selling Icons</h2>
              <p className="section-desc">Formulations celebrated repeatedly by luxury editors and clients.</p>
            </div>
            <Link to="/shop?bestseller=true" className="btn btn-outline">
              View All Best Sellers <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-products">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
              : bestsellers.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL BEAUTY ROUTINES SECTION */}
      <section style={{ padding: '6rem 0', background: '#F7F3EE' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">The Rituals</span>
            <h2 className="section-title">Curated Beauty Collections</h2>
            <p className="section-desc">
              Holistic rituals engineered to nourish, protect, and enhance your skin's vitality.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {editorialRoutines.map((routine, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src={routine.image}
                    alt={routine.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="routine-img"
                  />
                </div>
                <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary-rose)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    {routine.subtitle}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.7rem' }}>
                    {routine.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.4rem' }}>
                    {routine.desc}
                  </p>
                  <Link
                    to={routine.link}
                    style={{
                      marginTop: 'auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}
                  >
                    Discover Ritual <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-subtitle">Fresh Innovations</span>
              <h2 className="section-title" style={{ marginBottom: '0.3rem' }}>New In The Atelier</h2>
              <p className="section-desc">Latest breakthroughs from our laboratory in clean botanical science.</p>
            </div>
            <Link to="/shop?newArrival=true" className="btn btn-outline">
              Explore All New <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-products">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
              : newArrivals.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* 8. CLIENT REVIEWS / TESTIMONIALS */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">The Verdict</span>
            <h2 className="section-title">Words from Our Patrons</h2>
            <p className="section-desc">
              Real testimonials from verified clients and skincare experts who swear by Élora.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {customerTestimonials.map((t, index) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: '2.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', gap: '3px', color: '#D4AF37', marginBottom: '1.2rem' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" stroke="#D4AF37" />
                  ))}
                </div>

                <p style={{ fontStyle: 'italic', fontSize: '0.96rem', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '1.8rem', flex: 1 }}>
                  "{t.review}"
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--primary-rose)', fontWeight: 600, marginBottom: '1rem' }}>
                  Purchased: {t.productPurchased}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                  <CheckCircle size={16} color="var(--color-success)" style={{ marginLeft: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal Popup */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Category Hover Styles */}
      <style>{`
        .category-card:hover .cat-img {
          transform: scale(1.08);
        }
        .routine-img:hover {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
