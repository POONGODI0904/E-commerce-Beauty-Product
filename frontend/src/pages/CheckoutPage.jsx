import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  Sparkles,
  ArrowRight,
  Package,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const { cartItems, subtotal, shippingPrice, taxPrice, discountAmount, totalPrice, coupon, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Active step: 1 (Address), 2 (Summary), 3 (Payment), 4 (Confirmation)
  const [currentStep, setCurrentStep] = useState(1);

  // Address selection / new address form
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    houseFlat: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'United States'
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('Demo Card / Test Payment');
  const [cardForm, setCardForm] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user?.name || 'Sophia Laurent',
    expiry: '12/28',
    cvv: '888'
  });

  // Final created order state
  const [createdOrder, setCreatedOrder] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== 4) {
      navigate('/cart');
    }
  }, [cartItems, currentStep, navigate]);

  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultIndex = user.addresses.findIndex((a) => a.isDefault);
      setSelectedAddressIndex(defaultIndex >= 0 ? defaultIndex : 0);
    } else {
      setIsAddingNewAddress(true);
    }
  }, [user]);

  const activeShippingAddress = (!isAddingNewAddress && user?.addresses?.length > 0)
    ? user.addresses[selectedAddressIndex]
    : addressForm;

  const handleNextStep1 = async (e) => {
    e.preventDefault();
    if (isAddingNewAddress) {
      const { fullName, phone, houseFlat, street, city, state, pincode } = addressForm;
      if (!fullName || !phone || !houseFlat || !street || !city || !state || !pincode) {
        toastError('Please complete all delivery address fields');
        return;
      }
      if (user) {
        try {
          await addAddress(addressForm);
          setIsAddingNewAddress(false);
        } catch {
          // ignore error
        }
      }
    }
    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toastError('Please sign in or create an account to finalize order');
      navigate('/auth?redirect=checkout');
      return;
    }

    setSubmittingOrder(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          discountPrice: item.discountPrice,
          qty: item.qty
        })),
        shippingAddress: activeShippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        discountAmount,
        couponCode: coupon?.code || '',
        shippingPrice,
        taxPrice,
        totalPrice
      };

      const { data } = await api.post('/orders', orderPayload);
      setCreatedOrder(data);
      clearCart();
      setCurrentStep(4);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      success('Order placed successfully! Welcome to the Élora circle.');
    } catch (err) {
      toastError(err.message || 'Failed to place order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const steps = [
    { num: 1, label: 'Delivery Address' },
    { num: 2, label: 'Order Summary' },
    { num: 3, label: 'Payment' },
    { num: 4, label: 'Confirmation' }
  ];

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        
        {/* Step Stepper Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {/* Background line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '5%',
              right: '5%',
              height: '2px',
              background: '#E2D9D1',
              zIndex: 1
            }} />
            
            {/* Filled progress line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '5%',
              width: `${((currentStep - 1) / 3) * 90}%`,
              height: '2px',
              background: 'var(--primary-rose)',
              transition: 'width 0.4s ease',
              zIndex: 2
            }} />

            {steps.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isDone || isCurrent ? 'var(--primary-rose)' : '#FFFFFF',
                    color: isDone || isCurrent ? '#FFFFFF' : 'var(--text-muted)',
                    border: isDone || isCurrent ? '2px solid var(--primary-rose)' : '2px solid #E2D9D1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    boxShadow: isCurrent ? '0 0 0 4px var(--primary-rose-light)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {isDone ? <Check size={18} /> : s.num}
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    marginTop: '0.5rem',
                    fontWeight: isCurrent ? 600 : 400,
                    color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: ADDRESS */}
        {currentStep === 1 && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Shipping & Delivery Destination
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Where shall we dispatch your bespoke Élora formulations?
            </p>

            {/* If user has saved addresses */}
            {user?.addresses?.length > 0 && !isAddingNewAddress && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {user.addresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      style={{
                        padding: '1.2rem',
                        borderRadius: 'var(--radius-md)',
                        border: selectedAddressIndex === idx ? '2px solid var(--primary-rose)' : '1px solid var(--border-light)',
                        background: selectedAddressIndex === idx ? 'var(--primary-rose-light)' : '#FAF8F5',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <strong>{addr.fullName}</strong>
                        {addr.isDefault && <span className="badge badge-gold">Default</span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {addr.houseFlat}, {addr.street}<br />
                        {addr.city}, {addr.state} {addr.pincode}<br />
                        {addr.country} • {addr.phone}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="btn btn-outline btn-sm"
                >
                  + Deliver to a Different Address
                </button>
              </div>
            )}

            {/* Address Form */}
            {(isAddingNewAddress || !user?.addresses?.length) && (
              <form onSubmit={handleNextStep1}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">House / Apartment / Suite</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apt 4B"
                      value={addressForm.houseFlat}
                      onChange={(e) => setAddressForm({ ...addressForm, houseFlat: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 142 Mercer Street"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State / Province</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal / ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      required
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {user?.addresses?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="btn btn-outline"
                    >
                      Back to Saved Addresses
                    </button>
                  )}
                  <button type="submit" className="btn btn-rose" style={{ marginLeft: 'auto' }}>
                    Continue to Order Summary <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {!isAddingNewAddress && user?.addresses?.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button onClick={() => setCurrentStep(2)} className="btn btn-rose">
                  Continue to Order Summary <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: ORDER SUMMARY */}
        {currentStep === 2 && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Review Your Selections
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Confirm your bespoke items and delivery address before choosing payment.
            </p>

            {/* Destination Recap */}
            <div style={{ background: '#FAF7F4', padding: '1.2rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-rose)', fontWeight: 600 }}>
                  Shipping To:
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{activeShippingAddress.fullName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {activeShippingAddress.houseFlat}, {activeShippingAddress.street}, {activeShippingAddress.city}, {activeShippingAddress.state} {activeShippingAddress.pincode}
                </div>
              </div>
              <button onClick={() => setCurrentStep(1)} className="btn btn-outline btn-sm">
                Change
              </button>
            </div>

            {/* Products List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {cartItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '10px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Quantity: {item.qty} × ${item.discountPrice.toFixed(2)}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    ${(item.discountPrice * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div style={{ background: '#FDFCFA', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: 'var(--primary-rose)' }}>
                  <span>Discount ({coupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span>Complimentary / Royal Shipping</span>
                <span>{shippingPrice === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span>Estimated Sales Tax</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.8rem', marginTop: '0.8rem', fontWeight: 700, fontSize: '1.2rem' }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--primary-rose)' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(1)} className="btn btn-outline">
                Back to Address
              </button>
              <button onClick={() => setCurrentStep(3)} className="btn btn-rose">
                Select Payment Method <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {currentStep === 3 && (
          <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Choose Payment Method
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              All transactions are encrypted with 256-bit security. Never stored on our servers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
              {/* Option 1: Demo Card */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.2rem',
                borderRadius: 'var(--radius-md)',
                border: paymentMethod === 'Demo Card / Test Payment' ? '2px solid var(--primary-rose)' : '1px solid var(--border-light)',
                background: paymentMethod === 'Demo Card / Test Payment' ? 'var(--primary-rose-light)' : '#FFFFFF',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="Demo Card / Test Payment"
                  checked={paymentMethod === 'Demo Card / Test Payment'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={22} color="var(--primary-rose)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Demo Credit Card / Instant Payment</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pre-filled sandbox test card for immediate verification.</div>
                </div>
              </label>

              {/* Option 2: Cash on Delivery */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.2rem',
                borderRadius: 'var(--radius-md)',
                border: paymentMethod === 'Cash on Delivery' ? '2px solid var(--primary-rose)' : '1px solid var(--border-light)',
                background: paymentMethod === 'Cash on Delivery' ? 'var(--primary-rose-light)' : '#FFFFFF',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Banknote size={22} color="var(--primary-rose)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay upon physical package handover by our courier.</div>
                </div>
              </label>
            </div>

            {/* If Demo Card selected, show realistic dummy card details */}
            {paymentMethod === 'Demo Card / Test Payment' && (
              <div style={{ background: '#FAF7F4', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-rose)', marginBottom: '1rem' }}>
                  Demo Sandbox Credentials
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.88rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Card Number</span>
                    <strong>{cardForm.cardNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Card Holder</span>
                    <strong>{cardForm.cardHolder}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Expires</span>
                    <strong>{cardForm.expiry}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Security CVV</span>
                    <strong>{cardForm.cvv}</strong>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setCurrentStep(2)} className="btn btn-outline">
                Back to Summary
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={submittingOrder}
                className="btn btn-rose btn-lg"
              >
                {submittingOrder ? 'Placing Order...' : `Complete Purchase ($${totalPrice.toFixed(2)})`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMATION */}
        {currentStep === 4 && createdOrder && (
          <div className="glass-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', background: '#FFFFFF' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: '#F0FDF4',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Check size={44} />
            </div>

            <span className="section-subtitle" style={{ color: 'var(--color-success)' }}>
              Purchase Complete
            </span>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.8rem' }}>
              Thank You for Your Order
            </h1>

            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2rem auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Your order has been registered in the boutique system. We are preparing your formulations with utmost care and luxury satin wrapping.
            </p>

            {/* Order Confirmation Card */}
            <div style={{
              background: '#FAF8F5',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.8rem',
              maxWidth: '560px',
              margin: '0 auto 2.5rem auto',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Number</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>#{createdOrder._id.slice(-8).toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Status</span>
                  <div><span className="badge badge-gold">{createdOrder.orderStatus}</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment Method:</span>
                <strong>{createdOrder.paymentMethod}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Paid:</span>
                <strong>${createdOrder.totalPrice.toFixed(2)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping Address:</span>
                <span style={{ maxWidth: '280px', textAlign: 'right' }}>
                  {createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to={`/order-tracking/${createdOrder._id}`} className="btn btn-rose btn-lg">
                <Truck size={18} /> Track Your Order Live
              </Link>
              <Link to="/shop" className="btn btn-outline btn-lg">
                Continue Exploring Atelier
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutPage;
