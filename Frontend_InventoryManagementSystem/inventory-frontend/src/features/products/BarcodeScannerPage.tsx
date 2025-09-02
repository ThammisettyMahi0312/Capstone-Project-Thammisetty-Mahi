import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScanner from './BarcodeScanner';

const BarcodeScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scannedProduct, setScannedProduct] = useState<any>(null);

  const handleProductSelect = (product: any) => {
    setScannedProduct(product);
    // You can navigate to the product page or show details here
    alert(`Scanned: ${product.name} (${product.sku})`);
  };

  const handleCloseScanner = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Barcode Scanner</h1>
            <button
              onClick={handleCloseScanner}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>

          {scannedProduct ? (
            <div className="scan-results">
              <h2 className="text-xl font-semibold mb-4">Scan Results</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-800">{scannedProduct.name}</h3>
                <p className="text-green-600">SKU: {scannedProduct.sku}</p>
                <p className="text-green-600">Price: ${scannedProduct.price}</p>
                <p className="text-green-600">Stock: {scannedProduct.quantity} units</p>
                
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => navigate(`/products/${scannedProduct.id}/edit`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Product
                  </button>
                  <button
                    onClick={() => setScannedProduct(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <BarcodeScanner 
              isOpen={true}
              onClose={handleCloseScanner}
              onProductSelect={handleProductSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerPage;