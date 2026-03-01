import React, { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import {
  CurrencyDollarIcon,
  CubeIcon,
  StarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    averageRating: 0,
    outOfStock: 0,
    monthlyGrowth: 12.5
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 5 });
      const products = response.data;
      
      setRecentProducts(products);
      
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, p) => sum + p.price, 0);
      const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts || 0;
      const outOfStock = products.filter(p => !p.in_stock).length;

      setStats({
        totalProducts,
        totalValue,
        averageRating: averageRating.toFixed(1),
        outOfStock,
        monthlyGrowth: 12.5
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'ផលិតផលសរុប',
      value: stats.totalProducts,
      icon: CubeIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '+5%',
      trendUp: true
    },
    {
      name: 'ទឹកប្រាក់សរុប',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: '+12%',
      trendUp: true
    },
    {
      name: 'ការវាយតម្លៃមធ្យម',
      value: stats.averageRating,
      icon: StarIcon,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      trend: '+0.3',
      trendUp: true
    },
    {
      name: 'អស់ស្តុក',
      value: stats.outOfStock,
      icon: ShoppingBagIcon,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      trend: '-2',
      trendUp: false
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ទិដ្ឋភាពទូទៅ</h1>
        <p className="text-gray-600">តាមដានដំណើរការហាង និងសូចនាកររបស់អ្នក</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className={`bg-gradient-to-r ${stat.color} rounded-xl p-3 shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              
              <div className={`flex items-center text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trendUp ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">ផលិតផលថ្មីៗ</h2>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md">
              មើលផលិតផលទាំងអស់
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {recentProducts.map((product, index) => (
            <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <img
                  src={`http://localhost:8000/${product.main_image}`}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl shadow-sm"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                  }}
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(product.rating || 0) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">({product.reviews || 0})</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${product.price}</p>
                  <div className={`mt-1 ${product.in_stock ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-3 py-1 rounded-full text-xs font-medium`}>
                    {product.in_stock ? 'នៅក្នុងស្តុក' : 'អស់ស្តុក'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-4">
            <CubeIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">បន្ថែមផលិតផលថ្មី</h3>
          <p className="text-sm text-gray-600 mb-4">បន្ថែមផលិតផលថ្មីទៅក្នុងស្តុករបស់អ្នក</p>
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md">
            បន្ថែមផលិតផល
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-4">
            <CurrencyDollarIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">មើលការលក់</h3>
          <p className="text-sm text-gray-600 mb-4">តាមដានដំណើរការលក់របស់អ្នក</p>
          <button className="w-full bg-white border-2 border-green-500 text-green-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-50 transition-all duration-200">
            មើលវិភាគទិន្នន័យ
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-4">
            <StarIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">មតិអតិថិជន</h3>
          <p className="text-sm text-gray-600 mb-4">អានមតិយោបល់ពីអតិថិជន</p>
          <button className="w-full bg-white border-2 border-purple-500 text-purple-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-50 transition-all duration-200">
            មើលមតិយោបល់
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;