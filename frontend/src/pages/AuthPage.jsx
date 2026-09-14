import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register, loginDemoAdmin, loginDemoUser } = useAuth();
  const { error: toastError, success } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate(redirect === 'checkout' ? '/checkout' : redirect);
      } else {
        if (formData.password !== formData.confirmPassword) {
          toastError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          toastError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await register(formData.name, formData.email, formData.password, formData.phone);
        navigate(redirect === 'checkout' ? '/checkout' : redirect);
      }
    } catch {
      // Toast displayed by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await loginDemoAdmin();
      navigate('/admin');
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUser = async () => {
    setLoading(true);
    try {
      await loginDemoUser();
      navigate(redirect === 'checkout' ? '/checkout' : '/dashboard');
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '4rem 1rem 6rem 1rem',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 20%, #FAF1EC 0%, #FAF8F5 70%)'
    }}>
      <div className="glass-card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '3rem 2.5rem',
        background: '#FFFFFF',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius-xl)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', letterSpacing: '0.1em', fontWeight: 600, display: 'block' }}>
            ÉLORA BEAUTY
          </span>
          <span className="section-subtitle" style={{ marginTop: '0.3rem' }}>
            {isLogin ? 'Client Access' : 'Create Your Account'}
          </span>
          <h2 style={{ fontSize: '1.6rem', marginTop: '0.5rem', fontWeight: 500 }}>
            {isLogin ? 'Welcome to The Atelier' : 'Begin Your Ritual'}
          </h2>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div style={{
          background: '#FAF7F4',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-rose)', fontWeight: 600, marginBottom: '0.6rem', textAlign: 'center' }}>
            ⚡ Instant 1-Click Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={loading}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.45rem', fontSize: '0.78rem' }}
            >
              🛡️ Demo Admin
            </button>
            <button
              type="button"
              onClick={handleDemoUser}
              disabled={loading}
              className="btn btn-rose btn-sm"
              style={{ padding: '0.45rem', fontSize: '0.78rem' }}
            >
              ✨ Demo Client
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="Sophia Laurent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="client@elora.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-rose btn-lg"
            style={{ width: '100%', marginTop: '1.2rem' }}
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Boutique' : 'Create Client Account'}
          </button>
        </form>

        {/* Toggle Login vs Register */}
        <div style={{ textAlign: 'center', marginTop: '1.8rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account yet?" : 'Already a registered client?'}
          </span>{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary-rose)', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLogin ? 'Register Here' : 'Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
