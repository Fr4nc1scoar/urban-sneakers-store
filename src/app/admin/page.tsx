'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Order,
  Product,
  StoreSettings,
  Installment,
} from '@/types';
import {
  Shield,
  ShoppingBag,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  MessageCircle,
  Sliders,
  DollarSign,
  Calendar,
  Save,
  ArrowLeft,
  Flame,
  Check,
  Eye,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  TrendingUp,
  Tag,
  Zap,
  X,
} from 'lucide-react';
import AdminInstallmentModal from '@/components/AdminInstallmentModal';

function formatDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${mins}`;
  } catch {
    return dateStr;
  }
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  // Orders filters
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'credit' | 'completed'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Products filters
  const [productBrandFilter, setProductBrandFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');

  // Pricing Rule Suite States
  const [showBulkPricingModal, setShowBulkPricingModal] = useState(false);
  const [bulkRuleType, setBulkRuleType] = useState<'all' | 'brand' | 'margin'>('all');
  const [bulkPriceValue, setBulkPriceValue] = useState<number>(50);
  const [bulkBrandValue, setBulkBrandValue] = useState<string>('Nike');
  const [bulkMarginValue, setBulkMarginValue] = useState<number>(25);
  const [isApplyingBulkPrice, setIsApplyingBulkPrice] = useState(false);
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string | null>(null);

  // Quick edit single product price tracking
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>({});
  const [savedPriceId, setSavedPriceId] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Installment modal state
  const [selectedOrderForCredit, setSelectedOrderForCredit] = useState<Order | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Check auth on load
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_unlocked');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    // Default PIN: alberto2026 or admin123
    const validPins = ['alberto2026', 'admin123', '584248057420'];
    if (validPins.includes(passwordInput.trim().toLowerCase())) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_unlocked', 'true');
    } else {
      setAuthError('Contraseña incorrecta. Intenta nuevamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_unlocked');
    setPasswordInput('');
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOrders, resProducts, resSettings] = await Promise.all([
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
      ]);

      if (resOrders.success) setOrders(resOrders.orders);
      if (resProducts.success) setProducts(resProducts.products);
      if (resSettings.success) {
        setSettings(resSettings.settings);
        setSettingsForm(resSettings.settings);
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle Sync from loading-stylee.ola.click
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: settings?.defaultShoePrice || 50 }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`¡Sincronización completada! ${data.totalSynced} productos actualizados (${data.newAdded} nuevos).`);
        fetchData();
      } else {
        setSyncMessage(`Error: ${data.error || 'No se pudo sincronizar'}`);
      }
    } catch (err: any) {
      setSyncMessage(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  // Handle Bulk Pricing Rule Application
  const handleApplyBulkPricing = async () => {
    setIsApplyingBulkPrice(true);
    setBulkSuccessMessage(null);
    try {
      const payload: any = {
        bulkUpdate: {
          rule: bulkRuleType,
          targetPrice: bulkPriceValue,
          targetBrand: bulkBrandValue,
          marginAmount: bulkMarginValue,
        },
      };

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setBulkSuccessMessage(`¡Precios aplicados con éxito! (${data.count} productos modificados).`);
        await fetchData();
        setTimeout(() => {
          setShowBulkPricingModal(false);
          setBulkSuccessMessage(null);
        }, 2000);
      } else {
        alert(data.error || 'Error al aplicar regla de precios');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsApplyingBulkPrice(false);
    }
  };

  // Handle quick single product price change
  const handleSaveSinglePrice = async (productId: string) => {
    const newPrice = editingPrices[productId];
    if (newPrice === undefined || isNaN(newPrice) || newPrice <= 0) return;

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, price: newPrice }),
      });

      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, price: newPrice } : p))
        );
        setSavedPriceId(productId);
        setTimeout(() => setSavedPriceId(null), 2000);
      }
    } catch (err) {
      console.error('Error saving single price', err);
    }
  };

  // Handle Order Status change
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  // Handle Save Credit Plan
  const handleSaveCreditPlan = async (orderId: string, updatedPlan: Order['creditPlan']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditPlan: updatedPlan, isCredit: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? data.order : o))
        );
      }
    } catch (err) {
      console.error('Error saving credit plan', err);
    }
  };

  // Handle single installment toggle
  const handleUpdateInstallmentStatus = async (
    orderId: string,
    installmentId: string,
    status: Installment['status'],
    paymentMethod?: string,
    notes?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          installmentUpdate: { installmentId, status, paymentMethod, notes },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? data.order : o))
        );
      }
    } catch (err) {
      console.error('Error updating installment', err);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    setIsSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('¿Seguro que deseas eliminar este pedido permanentemente?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    } catch (err) {
      console.error('Error deleting order', err);
    }
  };

  // Metrics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending_confirmation').length;

  // Credit metrics
  let totalInCredit = 0;
  let overdueInstallmentsCount = 0;

  orders.forEach(o => {
    if (o.isCredit && o.creditPlan?.installments) {
      o.creditPlan.installments.forEach(inst => {
        if (inst.status !== 'paid') {
          totalInCredit += inst.amount;
          if (new Date(inst.dueDate) < new Date() || inst.status === 'overdue') {
            overdueInstallmentsCount++;
          }
        }
      });
    }
  });

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'pending' && o.status !== 'pending_confirmation') return false;
    if (orderFilter === 'credit' && !o.isCredit) return false;
    if (orderFilter === 'completed' && o.status !== 'completed') return false;

    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      const matchNumber = o.orderNumber.toLowerCase().includes(q);
      const matchCustomer = o.customer.name.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.toLowerCase().includes(q);
      return matchNumber || matchCustomer || matchPhone;
    }
    return true;
  });

  // Filtered products
  const filteredProducts = products.filter(p => {
    if (productBrandFilter !== 'all' && p.brand.toLowerCase() !== productBrandFilter.toLowerCase()) {
      return false;
    }
    if (productSearch) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  // Distinct brands
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  // If loading session check
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-[#08090e] flex items-center justify-center text-white">Cargando...</div>;
  }

  // LOGIN LOCK SCREEN (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090e] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#10121d] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-600/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">Panel Administrativo</h1>
            <p className="text-xs text-slate-400 mt-1">
              Ingresa la clave de acceso para gestionar pedidos y precios
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa tu clave de acceso..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white glass-button-glow flex items-center justify-center gap-2 transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Ingresar al Panel</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Volver a la tienda pública
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090e] text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-[#0d0f18]/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Tienda</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black shadow-lg shadow-rose-600/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-black text-white flex items-center gap-2">
                  <span>PANEL DE CONTROL</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    ADMIN
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Gestión de Pedidos, Créditos Quincenales y Precios
                </p>
              </div>
            </div>
          </div>

          {/* Sync & Logout Action */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50"
              title="Obtener últimos zapatos y tallas desde el catálogo externo"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Catálogo'}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              title="Cerrar sesión de administrador"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Sync notification banner */}
      {syncMessage && (
        <div className="bg-emerald-600/90 text-white text-xs font-semibold py-2.5 px-4 text-center flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Dashboard Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Pedidos
              </span>
              <ShoppingBag className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalOrdersCount}</span>
              {pendingOrdersCount > 0 && (
                <span className="text-xs font-bold text-amber-400">
                  ({pendingOrdersCount} pendientes)
                </span>
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Por Cobrar (Crédito)
              </span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">${totalInCredit}</span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Cuotas Vencidas
              </span>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400">{overdueInstallmentsCount}</span>
              <span className="text-xs text-slate-400">requieren cobro</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Catálogo Activo
              </span>
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{products.length}</span>
              <span className="text-xs text-slate-400">modelos en stock</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Gestión de Pedidos & Cuotas ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Inventario & Asignar Precios ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Ajustes & Contacto Vendedor</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & CREDITS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderFilter === 'all'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Todos ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter('pending')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderFilter === 'pending'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Pendientes ({pendingOrdersCount})
                </button>
                <button
                  onClick={() => setOrderFilter('credit')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderFilter === 'credit'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  A Crédito ({orders.filter(o => o.isCredit).length})
                </button>
                <button
                  onClick={() => setOrderFilter('completed')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderFilter === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Completados ({orders.filter(o => o.status === 'completed').length})
                </button>
              </div>

              <div className="w-full sm:w-64 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Buscar pedido, cliente, telf..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">No hay pedidos en este filtro</h3>
                <p className="text-xs text-slate-500">
                  Los pedidos realizados por los clientes en la tienda aparecerán aquí automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isCredit = order.isCredit || order.paymentPreference === 'credit';
                  const installments = order.creditPlan?.installments || [];
                  const paidCount = installments.filter(i => i.status === 'paid').length;

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                    >
                      {/* Left: Info & items */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono font-black text-rose-400 text-base">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400">
                            {formatDateTime(order.createdAt)}
                          </span>

                          {/* Status Badge Dropdown */}
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as Order['status'])
                            }
                            className={`text-xs font-bold py-1 px-2.5 rounded-xl border focus:outline-none ${
                              order.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : order.status === 'pending_confirmation'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : order.status === 'confirmed'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : order.status === 'in_delivery'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            <option value="pending_confirmation" className="bg-slate-900 text-amber-300">
                              Pendiente Confirmación
                            </option>
                            <option value="confirmed" className="bg-slate-900 text-blue-300">
                              Confirmado
                            </option>
                            <option value="in_delivery" className="bg-slate-900 text-purple-300">
                              En Entrega
                            </option>
                            <option value="completed" className="bg-slate-900 text-emerald-300">
                              Completado / Entregado
                            </option>
                            <option value="cancelled" className="bg-slate-900 text-rose-300">
                              Cancelado
                            </option>
                          </select>

                          {/* Payment tag */}
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                            {order.paymentPreference === 'credit'
                              ? 'A Crédito'
                              : order.paymentPreference === 'pago_movil'
                              ? 'Pago Móvil'
                              : order.paymentPreference === 'cash'
                              ? 'Efectivo'
                              : 'Binance'}
                          </span>
                        </div>

                        {/* Customer data */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-300">
                          <div>
                            <span className="text-slate-500">Cliente: </span>
                            <strong className="text-white">{order.customer.name}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500">Telf: </span>
                            <span>{order.customer.phone}</span>
                          </div>
                          {order.customer.idNumber && (
                            <div>
                              <span className="text-slate-500">C.I: </span>
                              <span>{order.customer.idNumber}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-500">Ciudad/Dir: </span>
                            <span>{order.customer.city} ({order.customer.address})</span>
                          </div>
                          {order.customer.notes && (
                            <div className="w-full text-slate-400 italic">
                              Notas: &quot;{order.customer.notes}&quot;
                            </div>
                          )}
                        </div>

                        {/* Shoe items thumbnails and sizes */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                              <div>
                                <span className="font-bold text-white block leading-tight">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Talla EU {item.size} • Cant: {item.quantity} • ${item.price}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Credit plan summary if active */}
                        {isCredit && (
                          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-amber-300">
                              <Calendar className="w-4 h-4 text-amber-400" />
                              <span>
                                <strong>Plan de Cuotas Quincenales:</strong> {paidCount} de {installments.length} cuotas pagadas
                              </span>
                            </div>

                            <button
                              onClick={() => setSelectedOrderForCredit(order)}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>Organizar / Cobrar Cuotas</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Total amount & Quick Actions */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800 gap-3">
                        <div className="text-left lg:text-right">
                          <span className="text-xs text-slate-400 block">Total del Pedido</span>
                          <span className="text-2xl font-black text-white">${order.totalAmount} USD</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Direct WhatsApp button to chat with customer (CLEAN FORMAT NO EMOJIS) */}
                          <a
                            href={`https://api.whatsapp.com/send?phone=${order.customer.phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hola ${order.customer.name}! Te escribo sobre tu pedido ${order.orderNumber}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all"
                            title="Abrir chat de WhatsApp con el cliente"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Manage credit / installments button */}
                          <button
                            onClick={() => setSelectedOrderForCredit(order)}
                            className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 transition-all"
                            title="Gestionar Cuotas Quincenales"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>

                          {/* Delete order */}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all"
                            title="Eliminar pedido"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS INVENTORY & PRICING SUITE */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Toolbar: Search, Brands & Bulk Pricing Launcher */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
                <button
                  onClick={() => setProductBrandFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    productBrandFilter === 'all'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Todas ({products.length})
                </button>
                {brands.slice(0, 6).map((b) => (
                  <button
                    key={b}
                    onClick={() => setProductBrandFilter(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      productBrandFilter.toLowerCase() === b.toLowerCase()
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <div className="w-full sm:w-60 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar zapato..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Bulk Pricing Suite Button */}
                <button
                  onClick={() => setShowBulkPricingModal(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-amber-500/20 transition-all"
                  title="Aplicar reglas de precios masivas"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Reglas de Precios Masivos</span>
                </button>
              </div>
            </div>

            {/* Products grid with inline editable prices */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.slice(0, 60).map((prod) => {
                const currentEditPrice = editingPrices[prod.id] !== undefined ? editingPrices[prod.id] : prod.price;
                const isSaved = savedPriceId === prod.id;

                return (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-2.5 relative">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-extrabold bg-black/80 text-rose-400">
                        {prod.brand}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white truncate" title={prod.name}>
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        Tallas: {prod.sizes.join(', ')}
                      </p>

                      {/* Interactive Price Modifier */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1 bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 flex-1">
                          <span className="text-xs text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            min="1"
                            value={currentEditPrice}
                            onChange={(e) =>
                              setEditingPrices({ ...editingPrices, [prod.id]: Number(e.target.value) })
                            }
                            className="w-full bg-transparent text-xs font-black text-white focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => handleSaveSinglePrice(prod.id)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSaved
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white'
                          }`}
                          title="Guardar precio para este zapato"
                        >
                          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length > 60 && (
              <p className="text-xs text-center text-slate-500">
                Mostrando los primeros 60 de {filteredProducts.length} zapatos. Usa el buscador o filtro de marcas para ubicar cualquier modelo específico.
              </p>
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && settingsForm && (
          <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-rose-500" />
                <span>Configuración de Tienda y Contacto</span>
              </h3>

              {settingsSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Ajustes guardados correctamente!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, storeName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Número de WhatsApp del Vendedor (Para recibir pedidos)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.ownerWhatsApp}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, ownerWhatsApp: e.target.value })
                    }
                    placeholder="584248057420"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Formato internacional: 584248057420 (+58 424-8057420)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Precio Base Inicial de Nuevos Zapatos ($ USD)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.defaultShoePrice}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        defaultShoePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Datos de Pago para Mensajes de Cobro
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Banco Pago Móvil:</label>
                    <input
                      type="text"
                      value={settingsForm.paymentDetails.pagoMovil.banco}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          paymentDetails: {
                            ...settingsForm.paymentDetails,
                            pagoMovil: {
                              ...settingsForm.paymentDetails.pagoMovil,
                              banco: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Cédula Titular:</label>
                    <input
                      type="text"
                      value={settingsForm.paymentDetails.pagoMovil.cedula}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          paymentDetails: {
                            ...settingsForm.paymentDetails,
                            pagoMovil: {
                              ...settingsForm.paymentDetails.pagoMovil,
                              cedula: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Teléfono Pago Móvil:</label>
                    <input
                      type="text"
                      value={settingsForm.paymentDetails.pagoMovil.telefono}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          paymentDetails: {
                            ...settingsForm.paymentDetails,
                            pagoMovil: {
                              ...settingsForm.paymentDetails.pagoMovil,
                              telefono: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Binance Pay ID:</label>
                    <input
                      type="text"
                      value={settingsForm.paymentDetails.binancePay.payId}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          paymentDetails: {
                            ...settingsForm.paymentDetails,
                            binancePay: {
                              ...settingsForm.paymentDetails.binancePay,
                              payId: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white glass-button-glow flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? 'Guardando Ajustes...' : 'Guardar Ajustes'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Bulk Pricing Modal */}
      {showBulkPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div
            className="relative w-full max-w-lg bg-[#11131f] border border-slate-700 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Reglas de Precios Masivos</h3>
                  <p className="text-xs text-slate-400">Aplica precios automáticos a grupos de zapatos</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkPricingModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bulkSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{bulkSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">
                  Selecciona la Regla:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkRuleType('all')}
                    className={`p-2.5 rounded-xl font-bold border text-center transition-all ${
                      bulkRuleType === 'all'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    A Todo el Catálogo
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkRuleType('brand')}
                    className={`p-2.5 rounded-xl font-bold border text-center transition-all ${
                      bulkRuleType === 'brand'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Por Marca
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkRuleType('margin')}
                    className={`p-2.5 rounded-xl font-bold border text-center transition-all ${
                      bulkRuleType === 'margin'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Margen de Ganancia
                  </button>
                </div>
              </div>

              {bulkRuleType === 'all' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <label className="block text-slate-300 font-bold">
                    Precio fijo para todos los zapatos ($ USD):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bulkPriceValue}
                    onChange={(e) => setBulkPriceValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-base font-black text-white"
                  />
                  <p className="text-[11px] text-slate-400">
                    Se actualizarán todos los {products.length} productos con este precio de venta.
                  </p>
                </div>
              )}

              {bulkRuleType === 'brand' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Selecciona la Marca:</label>
                    <select
                      value={bulkBrandValue}
                      onChange={(e) => setBulkBrandValue(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    >
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Precio para esta marca ($ USD):</label>
                    <input
                      type="number"
                      min="1"
                      value={bulkPriceValue}
                      onChange={(e) => setBulkPriceValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-base font-black text-white"
                    />
                  </div>
                </div>
              )}

              {bulkRuleType === 'margin' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <label className="block text-slate-300 font-bold">
                    Ganancia a sumar al costo del proveedor ($ USD):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bulkMarginValue}
                    onChange={(e) => setBulkMarginValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-base font-black text-white"
                  />
                  <p className="text-[11px] text-slate-400">
                    Ejemplo: Si un zapato cuesta $25 al mayor y pones $25 de margen, su precio final será $50.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowBulkPricingModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isApplyingBulkPrice}
                onClick={handleApplyBulkPricing}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white glass-button-glow flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isApplyingBulkPrice ? 'Aplicando Precios...' : 'Aplicar Precios Masivos'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit installments modal */}
      {selectedOrderForCredit && settings && (
        <AdminInstallmentModal
          order={selectedOrderForCredit}
          settings={settings}
          isOpen={true}
          onClose={() => setSelectedOrderForCredit(null)}
          onSavePlan={handleSaveCreditPlan}
          onUpdateInstallmentStatus={handleUpdateInstallmentStatus}
        />
      )}
    </div>
  );
}
