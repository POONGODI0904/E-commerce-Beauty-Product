import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Save,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const UserDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const { user, logout, updateProfile, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { wishlistCount } = useWishlist();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Modal / Form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    houseFlat: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'United States',
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.warn('Orders fetch error:', err.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone
      };
      if (profileForm.password) {
        payload.password = profileForm.password;
      }
      await updateProfile(payload);
      setProfileForm({ ...profileForm, password: '' });
    } catch {
      // Toast handled by AuthContext
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(addressFormData);
      setShowAddressForm(false);
      setAddressFormData({
        fullName: user?.name || '',
        phone: user?.phone || '',
        houseFlat: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'United States',
        isDefault: false
      });
    } catch {
      // Toast handled by AuthContext
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you wish to cancel this order?')) {
      try {
        await api.put(`/orders/${orderId}/cancel`);
        success('Order cancelled successfully.');
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        toastError(err.message || 'Cannot cancel this order');
      }
    }
  };

  // KPI calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    ['Order Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)
  ).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header Greeting */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Client Sanctuary</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', marginBottom: '0.4rem' }}>
            Welcome, {user?.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your personal skincare journey, address book, and live shipment logistics.
          </p>
        </div>

        {/* Dashboard Layout: Sidebar + Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }} className="dashboard-grid">
          
          {/* Sidebar Tabs */}
          <aside className="glass-card" style={{ padding: '1.2rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.8rem' }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt=""
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.email}
                </div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'profile', label: 'My Profile', icon: User },
                { id: 'orders', label: 'My Orders', icon: Clock },
                { id: 'addresses', label: 'Addresses', icon: MapPin }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSearchParams({ tab: tab.id })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: active ? 'var(--primary-rose-light)' : 'transparent',
                      color: active ? 'var(--primary-rose)' : 'var(--text-primary)',
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={18} /> {tab.label}
                  </button>
                );
              })}

              <Link
                to="/wishlist"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              >
                <Heart size={18} /> Wishlist ({wishlistCount})
              </Link>

              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  marginTop: '1rem',
                  borderTop: '1px solid var(--border-light)'
                }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Tab Content Panel */}
          <main>
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Total Orders</span>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      {totalOrders}
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Pending Delivery</span>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning)', marginTop: '0.2rem' }}>
                      {pendingOrders}
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Delivered Orders</span>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '0.2rem' }}>
                      {deliveredOrders}
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Saved in Wishlist</span>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--primary-rose)', marginTop: '0.2rem' }}>
                      {wishlistCount}
                    </div>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                  <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>Recent Orders</h3>
                    <button onClick={() => setSearchParams({ tab: 'orders' })} className="btn btn-outline btn-sm">
                      View All
                    </button>
                  </div>

                  {orders.slice(0, 3).length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {orders.slice(0, 3).map((ord) => (
                        <div key={ord._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#FAF8F5', borderRadius: '12px' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Order #{ord._id.slice(-8).toUpperCase()}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {new Date(ord.createdAt).toLocaleDateString()} • {ord.orderItems.length} items • ${ord.totalPrice.toFixed(2)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <span className="badge badge-gold">{ord.orderStatus}</span>
                            <Link to={`/order-tracking/${ord._id}`} className="btn btn-rose btn-sm">
                              Track
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 2. MY PROFILE */}
            {activeTab === 'profile' && (
              <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Personal Profile</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Keep your client details and login credentials updated.
                </p>

                <form onSubmit={handleProfileSubmit} style={{ maxWidth: '600px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Contact</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Update Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn btn-rose"
                    style={{ marginTop: '1rem' }}
                  >
                    <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* 3. MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Order History</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Review your past purchases, verify tracking numbers, and view invoice records.
                </p>

                {ordersLoading ? (
                  <p>Loading orders...</p>
                ) : orders.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map((ord) => (
                      <div key={ord._id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem', gap: '0.5rem' }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Order #{ord._id.slice(-8).toUpperCase()}</span>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Placed on {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <span className="badge badge-gold">{ord.orderStatus}</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>${ord.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Order Items preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.2rem' }}>
                          {ord.orderItems.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                              <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500 }}>{item.name}</div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                          <Link to={`/order-tracking/${ord._id}`} className="btn btn-rose btn-sm">
                            <Truck size={15} /> Track Delivery
                          </Link>

                          {['Order Placed', 'Confirmed'].includes(ord.orderStatus) && (
                            <button
                              onClick={() => handleCancelOrder(ord._id)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', fontSize: '0.82rem', cursor: 'pointer' }}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No orders placed yet.</p>
                    <Link to="/shop" className="btn btn-rose">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 4. ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>Address Book</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your preferred shipping destinations.</p>
                  </div>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="btn btn-rose btn-sm"
                  >
                    <Plus size={16} /> Add Address
                  </button>
                </div>

                {/* New Address Form Modal/Drawer */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} style={{ background: '#FAF8F5', padding: '1.8rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1.2rem' }}>Add New Destination</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={addressFormData.fullName}
                          onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          required
                          value={addressFormData.phone}
                          onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">House / Flat</label>
                        <input
                          type="text"
                          required
                          value={addressFormData.houseFlat}
                          onChange={(e) => setAddressFormData({ ...addressFormData, houseFlat: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Street</label>
                        <input
                          type="text"
                          required
                          value={addressFormData.street}
                          onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          required
                          value={addressFormData.city}
                          onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          required
                          value={addressFormData.state}
                          onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          required
                          value={addressFormData.pincode}
                          onChange={(e) => setAddressFormData({ ...addressFormData, pincode: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          required
                          value={addressFormData.country}
                          onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                      <button type="submit" className="btn btn-rose">
                        Save Address
                      </button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-outline">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                {user?.addresses && user.addresses.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {user.addresses.map((addr) => (
                      <div key={addr._id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.4rem', background: addr.isDefault ? 'var(--primary-rose-light)' : '#FAF8F5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong>{addr.fullName}</strong>
                          {addr.isDefault && <span className="badge badge-gold">Default</span>}
                        </div>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                          {addr.houseFlat}, {addr.street}<br />
                          {addr.city}, {addr.state} {addr.pincode}<br />
                          {addr.country} • {addr.phone}
                        </p>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          {!addr.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(addr._id)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--primary-rose)', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => deleteAddress(addr._id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', fontSize: '0.8rem', cursor: 'pointer', marginLeft: 'auto' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No saved addresses. Click "Add Address" above to save one.</p>
                )}
              </div>
            )}
          </main>
        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboardPage;
