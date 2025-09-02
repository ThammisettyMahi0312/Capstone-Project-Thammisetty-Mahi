// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useGetProductQuery, useUpdateProductMutation } from '../../services/productsApi';

// const EditProductPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const productId = Number(id);

//   const { data: product, isLoading } = useGetProductQuery(productId, {
//     skip: !productId,
//   });
//   const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

//   const [formData, setFormData] = useState({
//     name: '',
//     sku: '',
//     category: '',
//     quantity: 0,
//     price: 0,
//     lowStockThreshold: 0,
//   });

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || '',
//         sku: product.sku || '',
//         category: typeof product.category === 'string' ? product.category : product.category?.name || '',
//         quantity: product.quantity || 0,
//         price: product.price || 0,
//         lowStockThreshold: product.lowStockThreshold || 0,
//       });
//     }
//   }, [product]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'number' ? parseFloat(value) || 0 : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateProduct({
//         id: productId,
//         ...formData,
//       }).unwrap();
//       navigate('/products');
//     } catch (error) {
//       console.error('Failed to update product:', error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Product Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>

//             <div>
//               <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
//                 SKU
//               </label>
//               <input
//                 type="text"
//                 name="sku"
//                 id="sku"
//                 value={formData.sku}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>

//             <div>
//               <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                 Category
//               </label>
//               <input
//                 type="text"
//                 name="category"
//                 id="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>

//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
//                   Quantity
//                 </label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   id="quantity"
//                   min="0"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-gray-700">
//                   Price ($)
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   id="price"
//                   step="0.01"
//                   min="0"
//                   value={formData.price}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
//                 Low Stock Threshold
//               </label>
//               <input
//                 type="number"
//                 name="lowStockThreshold"
//                 id="lowStockThreshold"
//                 min="0"
//                 value={formData.lowStockThreshold}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => navigate('/products')}
//                 className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isUpdating}
//                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//               >
//                 {isUpdating ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProductPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    productName: 'iPhone',
    sku: 'ELEC-001',
    category: 'Electronics',
    quantity: 50,
    price: 100,
    lowStock: 5,
    notify: true,
  });
  
  const [errors, setErrors] = useState({
    productName: '',
    sku: '',
    quantity: '',
    price: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      productName: '',
      sku: '',
      quantity: '',
      price: '',
    };
    
    let isValid = true;
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'Please enter a product name';
      isValid = false;
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'Please enter a SKU';
      isValid = false;
    }
    
    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity = 'Please enter a valid quantity';
      isValid = false;
    }
    
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Please enter a valid price';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSaving(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSaving(false);
        setShowSuccess(true);
        
        // Hide success message after 2 seconds
        setTimeout(() => {
          setShowSuccess(false);
          alert('Product saved successfully!\n\n' +
                `Name: ${formData.productName}\n` +
                `SKU: ${formData.sku}\n` +
                `Category: ${formData.category}\n` +
                `Quantity: ${formData.quantity}\n` +
                `Price: $${formData.price}\n` +
                `Low Stock Threshold: ${formData.lowStock}\n` +
                `Notifications: ${formData.notify ? 'On' : 'Off'}`);
        }, 2000);
      }, 1500);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      alert('Changes discarded.');
      navigate('/products');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">
          Edit Product
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.productName && (
              <div className="text-red-500 text-sm mt-1">{errors.productName}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.sku && (
              <div className="text-red-500 text-sm mt-1">{errors.sku}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Books">Books</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.quantity && (
              <div className="text-red-500 text-sm mt-1">{errors.quantity}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.price && (
              <div className="text-red-500 text-sm mt-1">{errors.price}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="lowStock" className="block text-sm font-medium text-gray-700 mb-1">
              Low Stock Threshold
            </label>
            <input
              type="number"
              id="lowStock"
              name="lowStock"
              value={formData.lowStock}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="notify"
                name="notify"
                checked={formData.notify}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="notify" className="ml-2 text-sm text-gray-700">
                Get notified when stock falls below this level
              </label>
            </div>
          </div>
          
          {showSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Your changes have been saved successfully!
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;