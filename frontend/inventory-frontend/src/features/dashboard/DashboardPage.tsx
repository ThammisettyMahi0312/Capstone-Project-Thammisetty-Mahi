import React from 'react';
import { useGetInventorySummaryQuery } from '../../services/reportsApi';
import { useGetLowStockQuery } from '../../services/productsApi';
import StatCard from '../../components/StatCard';

const DashboardPage: React.FC = () => {
  const { data: inventorySummary, isLoading, error } = useGetInventorySummaryQuery();
  const { data: lowStockProducts } = useGetLowStockQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load dashboard data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={inventorySummary?.totalProducts?.toString() || '0'}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          }
        />
        <StatCard
          title="Low Stock Items"
          value={inventorySummary?.lowStockItems?.toString() || '0'}
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatCard
          title="Out of Stock"
          value={inventorySummary?.outOfStockItems?.toString() || '0'}
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />
        <StatCard
          title="Inventory Value"
          value={`$${(inventorySummary?.totalInventoryValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 01118 0z" />
            </svg>
          }
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <span className="font-medium">Low stock alert!</span> {lowStockProducts.length} product(s) are running low on inventory.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Top Products by Value</h3>
          <ul className="divide-y divide-gray-200">
            {inventorySummary?.topProducts?.map((product, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <span className="text-gray-700">{product.name}</span>
                <span className="font-medium text-gray-900">
                  ${(product.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </li>
            )) || (
              <li className="py-3 text-center text-gray-500">
                No data available
              </li>
            )}
          </ul>
        </div>

        {/* Recently Added */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recently Added Products</h3>
          <ul className="divide-y divide-gray-200">
            {inventorySummary?.recentlyAddedProducts?.map((product, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <span className="text-gray-700">{product.name}</span>
                <span className="text-sm text-gray-500">
                  {product.date ? new Date(product.date).toLocaleDateString() : 'N/A'}
                </span>
              </li>
            )) || (
              <li className="py-3 text-center text-gray-500">
                No data available
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;