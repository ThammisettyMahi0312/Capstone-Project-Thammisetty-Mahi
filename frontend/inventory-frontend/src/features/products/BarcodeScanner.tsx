// import React, { useState, useEffect, useRef } from 'react';
// import './BarcodeScanner.css';

// export interface BarcodeScannerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProductSelect?: (product: any) => void;
// }

// interface Product {
//   id: number;
//   name: string;
//   sku: string;
//   price: number;
//   quantity: number;
// }

// // Mock product data for demonstration
// const mockProducts: Product[] = [
//   { id: 1, name: 'Wireless Mouse', sku: 'ELEC-001', price: 25.99, quantity: 42 },
//   { id: 2, name: 'Office Chair', sku: 'FURN-001', price: 199.99, quantity: 15 },
//   { id: 3, name: 'Notebook Set', sku: 'STAT-001', price: 15.50, quantity: 100 },
//   { id: 4, name: 'Coffee Machine', sku: 'ELEC-002', price: 89.99, quantity: 8 },
// ];

// const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
//   isOpen, 
//   onClose, 
//   onProductSelect 
// }) => {
//   const [manualBarcode, setManualBarcode] = useState<string>('');
//   const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
//   const [isScanning, setIsScanning] = useState<boolean>(false);
//   const [scanError, setScanError] = useState<string>('');
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (isOpen) {
//       // Reset state when modal opens
//       setManualBarcode('');
//       setScannedProduct(null);
//       setScanError('');
//     }
//   }, [isOpen]);

//   const handleManualSearch = () => {
//     if (!manualBarcode.trim()) {
//       setScanError('Please enter a barcode number');
//       return;
//     }

//     // Find product by SKU
//     const product = mockProducts.find(p => p.sku === manualBarcode);
    
//     if (product) {
//       setScannedProduct(product);
//       setScanError('');
//       if (onProductSelect) {
//         onProductSelect(product);
//       }
//     } else {
//       setScanError(`No product found with SKU: ${manualBarcode}`);
//       setScannedProduct(null);
//     }
//   };

//   const simulateCameraScan = () => {
//     setIsScanning(true);
//     setScanError('');
    
//     // Simulate camera scanning process
//     setTimeout(() => {
//       // Randomly select a product for demonstration
//       const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
//       setScannedProduct(randomProduct);
//       setIsScanning(false);
      
//       if (onProductSelect) {
//         onProductSelect(randomProduct);
//       }
//     }, 2000);
//   };

//   const handleSelectProduct = () => {
//     if (scannedProduct && onProductSelect) {
//       onProductSelect(scannedProduct);
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="barcode-scanner-modal">
//       <div className="modal-overlay" onClick={onClose}></div>
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Barcode Scanner</h2>
//           <button onClick={onClose} className="close-btn">×</button>
//         </div>
        
//         <div className="scanner-section">
//           <h3>Enter Barcode Manually</h3>
//           <div className="input-group">
//             <input
//               type="text"
//               placeholder="Enter product SKU (e.g., ELEC-001)"
//               value={manualBarcode}
//               onChange={(e) => setManualBarcode(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
//             />
//             <button onClick={handleManualSearch} disabled={!manualBarcode.trim()}>
//               Search
//             </button>
//           </div>
          
//           {scanError && <div className="error-message">{scanError}</div>}
          
//           <div className="divider">--- Or ---</div>
          
//           <h3>Simulate Camera Scan</h3>
//           <div className="camera-simulation">
//             <div className="camera-view">
//               {isScanning ? (
//                 <div className="scanning-animation">
//                   <div className="scan-line"></div>
//                   <p>Scanning...</p>
//                 </div>
//               ) : (
//                 <div className="camera-placeholder">
//                   <div className="camera-icon">📷</div>
//                   <p>Camera preview would appear here</p>
//                 </div>
//               )}
//             </div>
            
//             <button 
//               onClick={simulateCameraScan} 
//               disabled={isScanning}
//               className="scan-button"
//             >
//               {isScanning ? 'Scanning...' : 'Start Camera Scan'}
//             </button>
            
//             <p className="camera-note">
//               Actual camera scanning would require additional libraries:<br />
//               quaggaJS, Dynamsoft Barcode Reader, or similar
//             </p>
//           </div>
//         </div>

//         {scannedProduct && (
//           <div className="scan-results">
//             <h3>Scan Results</h3>
//             <div className="product-card">
//               <h4>{scannedProduct.name}</h4>
//               <p><strong>SKU:</strong> {scannedProduct.sku}</p>
//               <p><strong>Price:</strong> ${scannedProduct.price.toFixed(2)}</p>
//               <p><strong>Stock:</strong> {scannedProduct.quantity} units</p>
              
//               <div className="product-actions">
//                 <button onClick={handleSelectProduct} className="select-product-btn">
//                   Select Product
//                 </button>
//                 <button onClick={() => setScannedProduct(null)} className="clear-btn">
//                   Clear Results
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="supported-barcodes">
//           <h4>Supported Barcode Types</h4>
//           <ul>
//             <li>UPC</li>
//             <li>EAN-13</li>
//             <li>Code 128</li>
//             <li>Code 39</li>
//             <li>QR Codes</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BarcodeScanner;


import React, { useState, useEffect, useRef } from 'react';
import './BarcodeScanner.css';

export interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect?: (product: any) => void;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

// Mock product data for demonstration
const mockProducts: Product[] = [
  { id: 1, name: 'Wireless Mouse X200', sku: 'ELEC-001', price: 25.99, quantity: 15 },
  { id: 2, name: 'Office Chair', sku: 'FURN-001', price: 199.99, quantity: 8 },
  { id: 3, name: 'Notebook Set', sku: 'STAT-001', price: 15.50, quantity: 42 },
  { id: 4, name: 'Coffee Machine', sku: 'ELEC-002', price: 89.99, quantity: 5 },
];

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
  isOpen, 
  onClose, 
  onProductSelect 
}) => {
  const [manualBarcode, setManualBarcode] = useState<string>('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setManualBarcode('');
      setScannedProduct(null);
      setScanError('');
    }
  }, [isOpen]);

  const handleManualSearch = () => {
    if (!manualBarcode.trim()) {
      setScanError('Please enter a product SKU');
      return;
    }

    // Find product by SKU
    const product = mockProducts.find(p => p.sku === manualBarcode);
    
    if (product) {
      setScannedProduct(product);
      setScanError('');
      if (onProductSelect) {
        onProductSelect(product);
      }
    } else {
      setScanError(`No product found with SKU: ${manualBarcode}`);
      setScannedProduct(null);
    }
  };

  const simulateCameraScan = () => {
    setIsScanning(true);
    setScanError('');
    
    // Simulate camera scanning process
    setTimeout(() => {
      // Randomly select a product for demonstration
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      setScannedProduct(randomProduct);
      setIsScanning(false);
      
      if (onProductSelect) {
        onProductSelect(randomProduct);
      }
    }, 2000);
  };

  const handleSelectProduct = () => {
    if (scannedProduct && onProductSelect) {
      onProductSelect(scannedProduct);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="barcode-scanner-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Barcode Scanner</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="scanner-section">
          <h3>Enter Barcode Manually</h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter product SKU (e.g., ELEC-001)"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
            />
            <button onClick={handleManualSearch} disabled={!manualBarcode.trim()}>
              Search
            </button>
          </div>
          
          {scanError && <div className="error-message">{scanError}</div>}
          
          <div className="divider">--- Or ---</div>
          
          <h3>Simulate Camera Scan</h3>
          <div className="camera-simulation">
            <div className="camera-view">
              {isScanning ? (
                <div className="scanning-animation">
                  <div className="scan-line"></div>
                  <p>Scanning...</p>
                </div>
              ) : (
                <div className="camera-placeholder">
                  <div className="camera-icon">📷</div>
                  <p>Camera preview would appear here</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={simulateCameraScan} 
              disabled={isScanning}
              className="scan-button"
            >
              {isScanning ? 'Scanning...' : 'Start Camera Scan'}
            </button>
            
            <p className="camera-note">
              Actual camera scanning would require additional libraries:<br />
              quaggaJS, Dynamsoft Barcode Reader, or similar
            </p>
          </div>
        </div>

        {scannedProduct && (
          <div className="scan-results">
            <h3>Scan Results</h3>
            <div className="product-card">
              <h4>{scannedProduct.name}</h4>
              <p><strong>SKU:</strong> {scannedProduct.sku}</p>
              <p><strong>Price:</strong> ${scannedProduct.price.toFixed(2)}</p>
              <p><strong>Stock:</strong> {scannedProduct.quantity} units</p>
              
              <div className="product-actions">
                <button onClick={handleSelectProduct} className="select-product-btn">
                  Select Product
                </button>
                <button onClick={() => setScannedProduct(null)} className="clear-btn">
                  Clear Results
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="supported-barcodes">
          <h4>Supported Barcode Types</h4>
          <table>
            <tbody>
              <tr>
                <td>UPC</td>
                <td>EAN-13</td>
                <td>Code 128</td>
                <td>Code 39</td>
                <td>QR Codes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;