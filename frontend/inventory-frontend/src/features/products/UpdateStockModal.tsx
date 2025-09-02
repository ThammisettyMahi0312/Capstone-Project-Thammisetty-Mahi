import React, { useState } from 'react';
import { useUpdateProductMutation } from '../../services/productsApi';

interface UpdateStockModalProps {
  productId: number;
  productName: string;
  currentStock: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateStockModal: React.FC<UpdateStockModalProps> = ({
  productId,
  productName,
  currentStock,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [stockChange, setStockChange] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct({
        id: productId,
        quantity: currentStock + stockChange,
      }).unwrap();
      onSuccess();
      onClose();
      setStockChange(0);
      setNotes('');
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900">Update Stock - {productName}</h3>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Stock: <span className="font-bold">{currentStock}</span>
              </label>
            </div>

            <div>
              <label htmlFor="stockChange" className="block text-sm font-medium text-gray-700">
                Stock Adjustment
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="stockChange"
                  name="stockChange"
                  value={stockChange}
                  onChange={(e) => setStockChange(Number(e.target.value))}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter positive number to add, negative to remove"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                New stock will be: {currentStock + stockChange}
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Reason for stock adjustment..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || stockChange === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateStockModal;