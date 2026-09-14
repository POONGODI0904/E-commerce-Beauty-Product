import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ContactPage = () => {
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: 'Skincare Consultation', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toastError('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    success('Message sent! Our client concierge will respond within 24 hours.');
    setForm({ name: '', email: '', subject: 'Skincare Consultation', message: '' });
  };

  return (
    <div style={{ padding: '4rem 0 6rem 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-subtitle">Client Concierge</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)', marginBottom: '0.8rem' }}>
            We Are Here to Assist You
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto', fontSize: '1.05rem' }}>
            Reach out for bespoke routine recommendations, order questions, or private consultation appointments.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem' }}>
          {/* Contact Details Card */}
          <div className="glass-card" style={{ padding: '2.8rem', background: '#FFFFFF' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1.5rem' }}>
              The Élora Boutique
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--primary-rose-light)', color: 'var(--primary-rose)', padding: '0.65rem', borderRadius: '50%' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Global Flagship Atelier</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginTop: '0.2rem' }}>
                    575 Fifth Avenue, Suite 900<br />
                    New York, NY 10017, USA
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--primary-rose-light)', color: 'var(--primary-rose)', padding: '0.65rem', borderRadius: '50%' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Electronic Inquiries</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                    concierge@elora.com<br />
                    press@elora.com
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--primary-rose-light)', color: 'var(--primary-rose)', padding: '0.65rem', borderRadius: '50%' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Client Telephone</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                    +1 (555) 019-2831<br />
                    Toll Free: 1-800-ELORA-BTY
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--primary-rose-light)', color: 'var(--primary-rose)', padding: '0.65rem', borderRadius: '50%' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Operating Hours</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                    Monday – Friday: 9:00 AM – 6:00 PM EST<br />
                    Saturday: 10:00 AM – 4:00 PM EST
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card" style={{ padding: '2.8rem', background: '#FFFFFF' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              Send a Dispatch
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.8rem' }}>
              Fill in your message details and an atelier consultant will assist you promptly.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sophia Laurent"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Purpose</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="form-select"
                >
                  <option value="Skincare Consultation">Personalized Skincare Consultation</option>
                  <option value="Order & Delivery Tracking">Order & Delivery Inquiries</option>
                  <option value="Ingredients & Formulations">Ingredient Safety & Allergies</option>
                  <option value="Bespoke Gift Sets">Bespoke Ritual Gifting</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How may we elevate your beauty experience?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-rose btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Send size={16} /> Transmit Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
