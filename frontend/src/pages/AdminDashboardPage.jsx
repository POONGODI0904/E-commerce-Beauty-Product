import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Tag,
  FolderTree,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  DollarSign,
  TrendingUp,
  Truck,
  ShieldCheck,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { success, error: toastError } = useToast();

  // Overview Stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Products
  const [products, setProducts] = useState([]);
  const [productKeyword, setProductKeyword] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'ÉLORA BEAUTY',
    category: 'Skincare',
    description: '',
    price: '',
    discount: 0,
    stock: 20,
    sku: '',
    images: '',
    ingredients: '',
    benefits: '',
    skinType: 'All Skin Types',
    usage: '',
    featured: false,
    bestseller: false,
    newArrival: false
  });

  // Orders
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('All');

  // Users
  const [users, setUsers] = useState([]);

  // Categories
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '', description: '' });

  // Coupons
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: 20,
    minOrder: 50,
    maxDiscount: 100,
    expiryDate: '',
    usageLimit: 100
  });

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.warn('Admin stats error:', err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(`/products?limit=100${productKeyword ? `&keyword=${encodeURIComponent(productKeyword)}` : ''}`);
      setProducts(data.products || []);
    } catch (err) {
      console.warn('Products fetch error:', err.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get(`/orders${orderFilter !== 'All' ? `?status=${encodeURIComponent(orderFilter)}` : ''}`);
      setOrders(data);
    } catch (err) {
      console.warn('Orders fetch error:', err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.warn('Users fetch error:', err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.warn('Categories fetch error:', err.message);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data);
    } catch (err) {
      console.warn('Coupons fetch error:', err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchUsers();
    fetchCategories();
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [productKeyword, orderFilter]);

  // Product CRUD Handlers
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        brand: prod.brand || 'ÉLORA BEAUTY',
        category: prod.category,
        description: prod.description,
        price: prod.price,
        discount: prod.discount || 0,
        stock: prod.stock,
        sku: prod.sku || '',
        images: Array.isArray(prod.images) ? prod.images.join(', ') : prod.images,
        ingredients: prod.ingredients || '',
        benefits: Array.isArray(prod.benefits) ? prod.benefits.join(', ') : '',
        skinType: prod.skinType || 'All Skin Types',
        usage: prod.usage || '',
        featured: prod.featured || false,
        bestseller: prod.bestseller || false,
        newArrival: prod.newArrival || false
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        brand: 'ÉLORA BEAUTY',
        category: 'Skincare',
        description: '',
        price: '',
        discount: 0,
        stock: 25,
        sku: '',
        images: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        ingredients: 'Aqua, Botanical Extracts, Hyaluronic Acid, Niacinamide.',
        benefits: 'Promotes skin cell turnover, Hydrates deeply',
        skinType: 'All Skin Types',
        usage: 'Smooth onto clean skin twice daily.',
        featured: false,
        bestseller: false,
        newArrival: true
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        discount: Number(productForm.discount),
        stock: Number(productForm.stock),
        images: productForm.images.split(',').map((img) => img.trim()).filter(Boolean),
        benefits: productForm.benefits.split(',').map((b) => b.trim()).filter(Boolean)
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        success('Product successfully updated in database!');
      } else {
        await api.post('/products', payload);
        success('New product added to catalog and live database!');
      }
      setShowProductModal(false);
      fetchProducts();
      fetchStats();
    } catch (err) {
      toastError(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product permanently from database?')) {
      try {
        await api.delete(`/products/${id}`);
        success('Product removed.');
        fetchProducts();
        fetchStats();
      } catch (err) {
        toastError(err.message || 'Failed to delete product');
      }
    }
  };

  // Order Status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      success(`Order status updated to ${newStatus}`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      toastError(err.message || 'Failed to update order status');
    }
  };

  // User status toggle
  const handleToggleUserStatus = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/toggle-status`);
      success(data.message);
      fetchUsers();
    } catch (err) {
      toastError(err.message || 'Failed to toggle user status');
    }
  };

  // Category creation
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', categoryForm);
      success('Category added.');
      setShowCategoryModal(false);
      setCategoryForm({ name: '', image: '', description: '' });
      fetchCategories();
    } catch (err) {
      toastError(err.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        success('Category removed.');
        fetchCategories();
      } catch (err) {
        toastError(err.message || 'Failed to delete category');
      }
    }
  };

  // Coupon creation
  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', couponForm);
      success('Coupon code activated!');
      setShowCouponModal(false);
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountAmount: 20,
        minOrder: 50,
        maxDiscount: 100,
        expiryDate: '',
        usageLimit: 100
      });
      fetchCoupons();
    } catch (err) {
      toastError(err.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`);
        success('Coupon deleted.');
        fetchCoupons();
      } catch (err) {
        toastError(err.message || 'Failed to delete coupon');
      }
    }
  };

  const navTabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'products', label: `Products (${products.length})`, icon: Package },
    { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
    { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
    { id: 'users', label: `Registered Clients (${users.length})`, icon: Users },
    { id: 'coupons', label: `Coupons & Offers (${coupons.length})`, icon: Tag }
  ];

  return (
    <div style={{ padding: '3rem 0 6rem 0', minHeight: '90vh', background: '#F8F6F2' }}>
      <div className="container" style={{ maxWidth: '1360px' }}>
        
        {/* Admin Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-rose)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Élora Atelier Administration Portal
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', marginTop: '0.2rem' }}>
              Management Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={() => handleOpenProductModal()}
              className="btn btn-rose"
            >
              <Plus size={16} /> Add New Formulation
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.6rem', marginBottom: '2.5rem' }}>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: 'var(--radius-full)',
                  border: active ? 'none' : '1px solid var(--border-light)',
                  background: active ? '#1A1715' : '#FFFFFF',
                  color: active ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={active ? '#D4AF37' : 'inherit'} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* KPI Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.8rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span>Total Sales Revenue</span>
                  <DollarSign size={18} color="var(--primary-rose)" />
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                  ${stats.totalSales.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-success)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <TrendingUp size={14} /> Completed boutique transactions
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.8rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span>Total Orders Placed</span>
                  <ShoppingBag size={18} color="var(--champagne-gold)" />
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                  {stats.totalOrders}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  {stats.pendingOrders} pending shipment • {stats.deliveredOrders} delivered
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.8rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span>Active Formulations</span>
                  <Package size={18} color="var(--primary-rose)" />
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                  {stats.totalProducts}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Across 6 luxury categories
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.8rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span>Registered Patrons</span>
                  <Users size={18} color="#2563EB" />
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                  {stats.totalUsers}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Verified customer accounts
                </div>
              </div>
            </div>

            {/* Low Stock Warnings Alert Banner */}
            {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#B45309', fontSize: '1rem' }}>
                    Low Inventory Warning ({stats.lowStockProducts.length} items with 5 units or less)
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.8rem' }}>
                    {stats.lowStockProducts.map((p) => (
                      <span key={p._id} style={{ background: '#FFFFFF', border: '1px solid #FCD34D', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.82rem' }}>
                        {p.name}: <strong style={{ color: '#DC2626' }}>{p.stock} left</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Visual Analytics Charts & Status Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              {/* Category Inventory Breakdown */}
              <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>Category Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {stats.categoryStats && stats.categoryStats.map((cat) => {
                    const pct = Math.round((cat.count / stats.totalProducts) * 100) || 0;
                    return (
                      <div key={cat._id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                          <span>{cat._id}</span>
                          <strong>{cat.count} items ({pct}%)</strong>
                        </div>
                        <div style={{ height: '8px', background: '#F0ECE8', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary-rose)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>Order Fulfillment Statuses</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Placed</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{stats.statusStats?.placed || 0}</div>
                  </div>
                  <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Confirmed</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{stats.statusStats?.confirmed || 0}</div>
                  </div>
                  <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Shipped / In Transit</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-rose)' }}>{stats.statusStats?.shipped || 0}</div>
                  </div>
                  <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Delivered</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-success)' }}>{stats.statusStats?.delivered || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', minWidth: '280px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search products in database..."
                  value={productKeyword}
                  onChange={(e) => setProductKeyword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', height: '40px' }}
                />
              </div>

              <button onClick={() => handleOpenProductModal()} className="btn btn-rose btn-sm">
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Products Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>Product</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Discount</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Stock</th>
                    <th style={{ padding: '0.8rem 1rem' }}>SKU</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img src={p.images[0]} alt="" style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.brand}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>{p.category}</td>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>{p.discount ? `${p.discount}%` : '—'}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span style={{ color: p.stock <= 5 ? 'var(--color-danger)' : 'inherit', fontWeight: p.stock <= 5 ? 700 : 400 }}>
                          {p.stock} units
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.sku || '—'}</td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenProductModal(p)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.3rem', color: 'var(--primary-rose)' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.3rem', color: 'var(--color-danger)', marginLeft: '0.5rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Customer Orders Management</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Filter Status:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '0.3rem 1.8rem 0.3rem 0.8rem', fontSize: '0.88rem' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>Order ID</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Client</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Items</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Total</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>
                        #{ord._id.slice(-8).toUpperCase()}
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div>{ord.shippingAddress?.fullName || ord.user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user?.email}</div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>{ord.orderItems?.length} formulations</td>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>${ord.totalPrice.toFixed(2)}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span className="badge badge-gold">{ord.orderStatus}</span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="form-select"
                          style={{ padding: '0.3rem 1.5rem 0.3rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Product Categories</h3>
              <button onClick={() => setShowCategoryModal(true)} className="btn btn-rose btn-sm">
                <Plus size={16} /> Add Category
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {categories.map((c) => (
                <div key={c._id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex' }}>
                  <img src={c.image} alt="" style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.8rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.itemCount || 0} products</div>
                    <button
                      onClick={() => handleDeleteCategory(c._id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left', marginTop: '0.4rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. USERS TAB */}
        {activeTab === 'users' && (
          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Registered Customer Directory</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>User</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Phone</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Joined Date</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Orders Placed</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>{u.phone || '—'}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{u.orderCount || 0}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span className={`badge ${u.isActive ? 'badge-success' : 'badge-sale'}`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleUserStatus(u._id)}
                          className={`btn btn-sm ${u.isActive ? 'btn-outline' : 'btn-rose'}`}
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Promotional Coupons</h3>
              <button onClick={() => setShowCouponModal(true)} className="btn btn-rose btn-sm">
                <Plus size={16} /> Create Coupon
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {coupons.map((cp) => (
                <div key={cp._id} style={{ border: '1px dashed var(--primary-rose)', background: 'var(--primary-rose-light)', borderRadius: 'var(--radius-md)', padding: '1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-rose)' }}>
                      {cp.code}
                    </span>
                    <button
                      onClick={() => handleDeleteCoupon(cp._id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {cp.discountAmount}{cp.discountType === 'percentage' ? '% OFF' : '$ OFF'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                    Min Order: ${cp.minOrder} • Max Discount: ${cp.maxDiscount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Times Used: {cp.timesUsed} / {cp.usageLimit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>
                {editingProduct ? 'Edit Formulation' : 'Add New Formulation'}
              </h2>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="form-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount (% off)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={productForm.images}
                    onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Ingredients</label>
                  <input
                    type="text"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skin Type</label>
                  <input
                    type="text"
                    value={productForm.skinType}
                    onChange={(e) => setProductForm({ ...productForm, skinType: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Benefits (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.benefits}
                    onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Badges Toggles */}
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '2rem', padding: '0.5rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    />
                    <span>Featured</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.bestseller}
                      onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                    />
                    <span>Bestseller</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.newArrival}
                      onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                    />
                    <span>New Arrival</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-rose">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CATEGORY */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1.2rem' }}>
              Add Category
            </h2>
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  required
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-rose">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {showCouponModal && (
        <div className="modal-overlay" onClick={() => setShowCouponModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1.2rem' }}>
              Create Promotional Coupon
            </h2>
            <form onSubmit={handleSaveCoupon}>
              <div className="form-group">
                <label className="form-label">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="form-input"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Discount Type</label>
                <select
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  className="form-select"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Dollar ($)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Discount Amount</label>
                <input
                  type="number"
                  required
                  value={couponForm.discountAmount}
                  onChange={(e) => setCouponForm({ ...couponForm, discountAmount: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Order ($)</label>
                <input
                  type="number"
                  value={couponForm.minOrder}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                  className="form-input"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCouponModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-rose">
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
