// import React, { useState, useRef, useEffect } from 'react';
// import QRCode from 'qrcode';
// import './QRCodeGenerator.css';

// interface QRCodeGeneratorProps {
//   productId: number;
//   productName: string;
//   productSku: string;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
//   productId,
//   productName,
//   productSku,
//   isOpen,
//   onClose
// }) => {
//   const [size, setSize] = useState(256);
//   const [qrCode, setQrCode] = useState('');
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (isOpen && canvasRef.current) {
//       generateQRCode();
//     }
//   }, [isOpen, size]);

//   const generateQRCode = async () => {
//     try {
//       if (canvasRef.current) {
//         // Generate QR code with product information
//         const qrData = JSON.stringify({
//           id: productId,
//           name: productName,
//           sku: productSku,
//           type: 'product'
//         });
        
//         await QRCode.toCanvas(canvasRef.current, qrData, {
//           width: size,
//           margin: 2,
//           color: {
//             dark: '#000000',
//             light: '#FFFFFF'
//           }
//         });
//         setQrCode(canvasRef.current.toDataURL('image/png'));
//       }
//     } catch (err) {
//       console.error('Error generating QR code:', err);
//     }
//   };

//   const downloadQRCode = () => {
//     if (!qrCode) {
//       alert('Please generate a QR code first');
//       return;
//     }

//     try {
//       const link = document.createElement('a');
//       link.href = qrCode;
//       link.download = `qrcode-${productSku}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Download error:', error);
//       alert('Error downloading QR code. Please try again.');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>QR Code for {productName}</h2>
//           <button className="close-button" onClick={onClose}>
//             &times;
//           </button>
//         </div>
        
//         <div className="qr-code-container">
//           <canvas ref={canvasRef} />
//         </div>
        
//         <div className="quality-control">
//           <label htmlFor="qr-size">Size:</label>
//           <input 
//             type="number" 
//             id="qr-size" 
//             value={size} 
//             onChange={(e) => setSize(parseInt(e.target.value))}
//             min="128" 
//             max="512" 
//           />
//         </div>
        
//         <div className="modal-actions">
//           <button onClick={downloadQRCode} className="download-button">
//             Download QR Code
//           </button>
//           <button onClick={onClose} className="cancel-button">
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QRCodeGenerator;

import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import './QRCodeGenerator.css';

interface QRCodeGeneratorProps {
  productId: number;
  productName: string;
  productSku: string;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  productId,
  productName,
  productSku,
  isOpen,
  onClose
}) => {
  const [size, setSize] = useState(256);
  const [qrCode, setQrCode] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateQRCode();
    }
  }, [isOpen, size]);

  const generateQRCode = async () => {
    try {
      if (canvasRef.current) {
        // Generate QR code with product information
        const qrData = JSON.stringify({
          id: productId,
          name: productName,
          sku: productSku,
          type: 'product'
        });
        
        await QRCode.toCanvas(canvasRef.current, qrData, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCode(canvasRef.current.toDataURL('image/png'));
      }
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) {
      alert('Please generate a QR code first');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `qrcode-${productSku}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading QR code. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>QR Code for {productName}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="qr-code-container">
          <canvas ref={canvasRef} />
        </div>
        
        <div className="quality-control">
          <label htmlFor="qr-size">Size:</label>
          <input 
            type="number" 
            id="qr-size" 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))}
            min="128" 
            max="512" 
          />
        </div>
        
        <div className="modal-actions">
          <button onClick={downloadQRCode} className="download-button">
            Download QR Code
          </button>
          <button onClick={onClose} className="cancel-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;