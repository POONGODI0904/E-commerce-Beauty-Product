import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Check,
  Clock,
  Truck,
  Package,
  MapPin,
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { error: toastError } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        toastError(err.message || 'Order tracking not available');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '65vh' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--primary-rose)' }}>
          Retrieving live courier logistics...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Please verify the order ID or log in to view your orders.
        </p>
        <Link to="/dashboard?tab=orders" className="btn btn-rose" style={{ marginTop: '1.5rem' }}>
          My Order History
        </Link>
      </div>
    );
  }

  const timelineSteps = order.trackingTimeline && order.trackingTimeline.length > 0
    ? order.trackingTimeline
    : [
        { status: 'Order Placed', completed: true, description: 'Your order has been received and logged.' },
        { status: 'Confirmed', completed: true, description: 'Payment and order verified.' },
        { status: 'Processing', completed: false, description: 'Curating items in clean room.' },
        { status: 'Packed', completed: false, description: 'Securely packaged with satin wrap.' },
        { status: 'Shipped', completed: false, description: 'Handed over to priority courier.' },
        { status: 'Out for Delivery', completed: false, description: 'Courier is in transit.' },
        { status: 'Delivered', completed: false, description: 'Delivered to address.' }
      ];

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        
        {/* Back Link */}
        <Link
          to="/dashboard?tab=orders"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-rose)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '2rem' }}
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        {/* Order Header Card */}
        <div className="glass-card" style={{ padding: '2rem 2.5rem', background: '#FFFFFF', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
            <div>
              <span className="section-subtitle">Real-Time Dispatch Tracker</span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', lineHeight: 1.2 }}>
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Placed On</span>
              <strong>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Payment Method</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Delivery Carrier</span>
              <strong>Royal Priority Express</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Amount</span>
              <strong style={{ color: 'var(--primary-rose)' }}>${order.totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Live Vertical Step-by-Step Progress Timeline */}
        <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={20} color="var(--primary-rose)" /> Fulfillment Timeline
          </h3>

          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* Vertical Line */}
            <div style={{
              position: 'absolute',
              top: '12px',
              bottom: '24px',
              left: '27px',
              width: '2px',
              background: '#E2D9D1',
              zIndex: 1
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
              {timelineSteps.map((step, idx) => {
                const isCurrent = step.status === order.orderStatus;
                const isCompleted = step.completed;

                return (
                  <div key={idx} style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
                    {/* Circle Node */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--primary-rose)' : isCurrent ? 'var(--champagne-gold)' : '#FFFFFF',
                      color: isCompleted || isCurrent ? '#FFFFFF' : 'var(--text-muted)',
                      border: isCompleted ? '2px solid var(--primary-rose)' : isCurrent ? '2px solid var(--champagne-gold)' : '2px solid #E2D9D1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isCurrent ? '0 0 0 5px var(--primary-rose-light)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {isCompleted ? <Check size={16} /> : isCurrent ? <Truck size={15} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D9CEC6' }} />}
                    </div>

                    {/* Step Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div style={{
                          fontWeight: isCompleted || isCurrent ? 600 : 400,
                          fontSize: '1.05rem',
                          color: isCompleted || isCurrent ? 'var(--text-primary)' : 'var(--text-muted)'
                        }}>
                          {step.status}
                        </div>
                        {step.timestamp && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                        {step.description || `Status update: ${step.status}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shipping Address and Items Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Address */}
          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--primary-rose)" /> Delivery Address
            </h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>{order.shippingAddress.fullName}</strong><br />
              {order.shippingAddress.houseFlat}, {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.phone}
            </div>
          </div>

          {/* Purchased Items */}
          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} color="var(--primary-rose)" /> Package Contents
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {order.orderItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Qty: {item.qty} × ${(item.discountPrice || item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderTrackingPage;
