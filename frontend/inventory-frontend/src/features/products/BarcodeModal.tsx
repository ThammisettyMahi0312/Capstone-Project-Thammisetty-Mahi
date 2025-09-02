import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeModalProps {
  productId: number;
  productName: string;
  productSku: string;
  isOpen: boolean;
  onClose: () => void;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({
  productId,
  productName,
  productSku,
  isOpen,
  onClose,
}) => {
  const [barcodeType, setBarcodeType] = useState('CODE128');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateBarcode();
    }
  }, [isOpen, barcodeType]);

  const generateBarcode = () => {
    try {
      if (canvasRef.current) {
        // Clear the canvas first
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Generate barcode using product SKU or ID
        JsBarcode(canvasRef.current, productSku || productId.toString(), {
          format: barcodeType,
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 16,
          background: "#ffffff",
          lineColor: "#000000"
        });
      }
    } catch (error) {
      console.error('Failed to generate barcode:', error);
    }
  };

  const downloadBarcode = () => {
    try {
      if (!canvasRef.current) {
        throw new Error('Barcode canvas not found');
      }
      
      const pngUrl = canvasRef.current.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${productName.replace(/\s+/g, '_')}_barcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading barcode. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900">Barcode for {productName}</h3>
          
          <div className="mt-4 space-y-4">
            {/* Barcode Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barcode Type
              </label>
              <select
                value={barcodeType}
                onChange={(e) => setBarcodeType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="CODE128">CODE 128</option>
                <option value="CODE39">CODE 39</option>
                <option value="EAN13">EAN-13</option>
                <option value="UPC">UPC</option>
              </select>
            </div>

            <div className="text-center">
              <canvas
                ref={canvasRef}
                id="barcode-canvas"
                className="mx-auto max-w-full h-32 object-contain border border-gray-200"
              />
              <p className="mt-2 text-sm text-gray-500">
                Scan this barcode to quickly identify the product
              </p>
              <button
                onClick={downloadBarcode}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download Barcode
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={generateBarcode}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Regenerate Barcode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;