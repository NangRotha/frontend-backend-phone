import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Settings from './pages/Settings';
import { productsAPI } from './services/api';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Modern Toast Configuration */}
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
              },
            },
          }}
        />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Analytics Page
const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    inStock: 0,
    outOfStock: 0,
    totalValue: 0,
    avgPrice: 0,
    avgRating: 0,
    categories: {},
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productsAPI.getAll();
        const data = res.data || [];
        setProducts(data);

        const total = data.length;
        const inStock = data.filter(p => p.in_stock).length;
        const outOfStock = total - inStock;
        const totalValue = data.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
        const avgPrice = total ? totalValue / total : 0;
        const avgRating = total ? (data.reduce((s, p) => s + (Number(p.rating) || 0), 0) / total) : 0;
        const categories = data.reduce((acc, p) => {
          const key = p.category || 'Uncategorized';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        setMetrics({ total, inStock, outOfStock, totalValue, avgPrice, avgRating, categories });
      } catch (e) {
        // errors handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const categoryEntries = Object.entries(metrics.categories).sort((a,b) => b[1]-a[1]);
  const maxCat = Math.max(1, ...categoryEntries.map(([,v]) => v));
  const inPct = metrics.total ? Math.round((metrics.inStock / metrics.total) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Insights about products inventory and performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">Σ</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.inStock}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-semibold">✔</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalValue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-semibold">$</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.avgRating.toFixed(1)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center font-semibold">★</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Products by Category</h2>
          </div>
          <div className="space-y-3">
            {categoryEntries.length === 0 && (
              <p className="text-sm text-gray-500">No categories available.</p>
            )}
            {categoryEntries.map(([name, count]) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 truncate mr-2">{name}</span>
                  <span className="text-xs text-gray-500">{count}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                    style={{ width: `${(count / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Stock Status</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-40 h-40">
              <div
                className="w-40 h-40 rounded-full"
                style={{
                  backgroundImage: `conic-gradient(#10b981 ${inPct}%, #ef4444 0)`,
                }}
              />
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{inPct}%</p>
                  <p className="text-xs text-gray-500">In Stock</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-700">In Stock</span>
                <span className="ml-auto font-medium">{metrics.inStock}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-gray-700">Out of Stock</span>
                <span className="ml-auto font-medium">{metrics.outOfStock}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-gray-700">Total</span>
                <span className="ml-auto font-medium">{metrics.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Rated */}
      <div className="mt-6 table-modern">
        <div className="table-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Rated Products</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {products
            .slice()
            .sort((a,b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5)
            .map((p) => (
              <div key={p.id} className="table-row">
                <div className="flex items-center">
                  <img
                    src={`http://localhost:8000/${p.main_image}`}
                    alt={p.name}
                    className="w-14 h-14 object-cover rounded-lg"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/56x56?text=No+Image'; }}
                  />
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 truncate">{p.brand} • {p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${p.price}</p>
                    <p className="text-xs text-yellow-600">★ {Number(p.rating || 0).toFixed(1)}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// Modern 404 Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-64 h-64 bg-primary-200 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl shadow-sm hover:shadow-md hover:from-primary-700 hover:to-primary-600 transition-all duration-200 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;