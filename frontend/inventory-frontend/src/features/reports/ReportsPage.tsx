import React from 'react';
import { useGetInventorySummaryQuery } from '../../services/reportsApi';
import { useGetProductsQuery } from '../../services/productsApi';

const ReportsPage: React.FC = () => {
  const { data: inventorySummary, isLoading } = useGetInventorySummaryQuery();
  const { data: products } = useGetProductsQuery();

  const exportToPDF = () => {
    // Create a PDF export
    const content = `
      Inventory Summary Report
      ========================
      Total Products: ${inventorySummary?.totalProducts}
      Low Stock Items: ${inventorySummary?.lowStockItems}
      Out of Stock Items: ${inventorySummary?.outOfStockItems}
      Total Inventory Value: $${inventorySummary?.totalInventoryValue?.toLocaleString()}
      
      Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory-summary.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    // Create a CSV export of products
    if (!products) return;
    
    const headers = 'Name,SKU,Category,Quantity,Price,Stock Status\n';
    const csvContent = products.map(product => 
      `"${product.name}","${product.sku || ''}","${typeof product.category === 'string' ? product.category : product.category?.name || ''}",${product.quantity},${product.price},"${product.quantity === 0 ? 'Out of Stock' : product.quantity <= (product.lowStockThreshold || 0) ? 'Low Stock' : 'In Stock'}"`
    ).join('\n');
    
    const csv = headers + csvContent;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product-list.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Create an Excel-like export (using CSV format)
    if (!products) return;
    
    const headers = 'Name,SKU,Category,Quantity,Price,Low Stock Threshold,Stock Status\n';
    const csvContent = products.map(product => 
      `"${product.name}","${product.sku || ''}","${typeof product.category === 'string' ? product.category : product.category?.name || ''}",${product.quantity},${product.price},${product.lowStockThreshold || 0},"${product.quantity === 0 ? 'Out of Stock' : product.quantity <= (product.lowStockThreshold || 0) ? 'Low Stock' : 'In Stock'}"`
    ).join('\n');
    
    const csv = headers + csvContent;
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stock-report.xls';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
      
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Inventory Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Product Count</h3>
            <p className="text-3xl font-bold text-blue-600">{inventorySummary?.totalProducts}</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Inventory Value</h3>
            <p className="text-3xl font-bold text-green-600">
              ${inventorySummary?.totalInventoryValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold text-amber-600">{inventorySummary?.lowStockItems}</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Out of Stock Items</h3>
            <p className="text-3xl font-bold text-red-600">{inventorySummary?.outOfStockItems}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Top Products by Value</h3>
            <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
              {inventorySummary?.topProducts?.map((product, index) => (
                <li key={index} className="px-4 py-3 flex justify-between items-center">
                  <span className="text-gray-700">{product.name}</span>
                  <span className="font-medium text-gray-900">${product.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Recently Added Products</h3>
            <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
              {inventorySummary?.recentlyAddedProducts?.map((product, index) => (
                <li key={index} className="px-4 py-3 flex justify-between items-center">
                  <span className="text-gray-700">{product.name}</span>
                  <span className="text-sm text-gray-500">{new Date(product.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Reports</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={exportToPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export Inventory Summary (PDF)
          </button>
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export Product List (CSV)
          </button>
          <button 
            onClick={exportToExcel}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Export Stock Report (Excel)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;