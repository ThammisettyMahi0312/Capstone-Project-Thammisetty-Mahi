import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../services/productsApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploadModal from './ImageUploadModal';
import BarcodeScanner from './BarcodeScanner';
import BarcodeModal from './BarcodeModal';
import QRCodeGenerator from './QRCodeGenerator';

const ProductsPage: React.FC = () => {
  const { data: products = [], isLoading, error } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const name = product.name?.toLowerCase() ?? '';
      const sku = product.sku?.toLowerCase() ?? '';
      const category =
        typeof product.category === 'string'
          ? product.category.toLowerCase()
          : product.category?.name?.toLowerCase() ?? '';
      return (
        name.includes(searchTerm.toLowerCase()) ||
        sku.includes(searchTerm.toLowerCase()) ||
        category.includes(searchTerm.toLowerCase())
      );
    });
  }, [products, searchTerm]);

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap();
      } catch (err) {
        console.error('Failed to delete product: ', err);
      }
    }
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleImageUploadClick = (productId: number) => {
    setSelectedProductId(productId);
    setImageModalOpen(true);
  };

  const handleImageUploadSuccess = () => {
    setImageModalOpen(false);
  };

  const handleBarcodeClick = (product: any) => {
    setSelectedProduct(product);
    setBarcodeModalOpen(true);
  };

  const handleQRCodeClick = (product: any) => {
    setSelectedProduct(product);
    setQrModalOpen(true);
  };

  const handleScanClick = () => {
    setScannerOpen(true);
  };

  const handleProductSelect = (product: any) => {
    alert(`Scanned: ${product.name} (${product.sku})`);
  };

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
              Failed to load products. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={handleScanClick}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Scan Barcode
          </button>
          <Link
            to="/products/new"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new product.
              </p>
              <div className="mt-6">
                <Link
                  to="/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Product
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden bg-gray-200">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {typeof product.category === 'string'
                        ? product.category
                        : product.category?.name}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-gray-900">
                        ${(product.price || 0).toFixed(2)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.quantity === 0
                            ? 'bg-red-100 text-red-800'
                            : product.quantity <= (product.lowStockThreshold || 0)
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.quantity} in stock
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="flex-1 text-center px-3 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleBarcodeClick(product)}
                        className="flex-1 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Barcode
                      </button>
                      <button
                        onClick={() => handleQRCodeClick(product)}
                        className="flex-1 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        QR Code
                      </button>
                      <button
                        onClick={() => handleImageUploadClick(product.id)}
                        className="flex-1 px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Image
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="flex-1 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />

      {imageModalOpen && selectedProductId && (
        <ImageUploadModal
          productId={selectedProductId}
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          onSuccess={handleImageUploadSuccess}
        />
      )}

      {/* Barcode Scanner Modal */}
      {scannerOpen && (
        <BarcodeScanner
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onProductSelect={handleProductSelect}
        />
      )}

      {/* Barcode Display Modal */}
      {barcodeModalOpen && selectedProduct && (
        <BarcodeModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          productSku={selectedProduct.sku}
          isOpen={barcodeModalOpen}
          onClose={() => setBarcodeModalOpen(false)}
        />
      )}

      {/* QR Code Modal */}
      {qrModalOpen && selectedProduct && (
        <QRCodeGenerator
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          productSku={selectedProduct.sku}
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductsPage;