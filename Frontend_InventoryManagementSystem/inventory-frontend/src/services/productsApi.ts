import { api } from './api';


export type Product = {
  id: number;
  name: string;
  sku?: string;
  category?: string | { id: number; name: string };
  quantity: number;
  price: number;
  lowStockThreshold?: number;
  imageUrl?: string;
  barcode?: string;
};

// Mock data with your requested images
const mockProducts = [
  {
    id: 1,
    name: "Wireless Mouse",
    sku: "ELEC-001",
    category: "Electronics",
    quantity: 42,
    price: 25.99,
    lowStockThreshold: 10,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Office Chair",
    sku: "FURN-001",
    category: "Furniture",
    quantity: 15,
    price: 199.99,
    lowStockThreshold: 5,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG9mZmljZSUyMGNoYWlyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Notebook Set",
    sku: "STAT-001",
    category: "Stationery",
    quantity: 100,
    price: 15.50,
    lowStockThreshold: 20,
    imageUrl: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG5vdGVib29rfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    name: "Coffee Machine",
    sku: "ELEC-002",
    category: "Electronics",
    quantity: 8,
    price: 89.99,
    lowStockThreshold: 5,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvZmZlZSUyMG1hY2hpbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    name: "T-Shirt (Pack of 3)",
    sku: "CLOTH-001",
    category: "Clothing",
    quantity: 75,
    price: 29.99,
    lowStockThreshold: 15,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHQlMjBzaGlydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  }
];

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => ({ url: "/api/products" }),
      providesTags: ["Product"],
      transformResponse: (response) => {
        // For demo purposes, return mock data with your images
        return mockProducts;
      }
    }),
    getProduct: build.query<Product, number>({
      query: (id) => ({ url: `/api/products/${id}` }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
      transformResponse: (response, meta, id) => {
        // For demo purposes, return mock data
        return mockProducts.find(p => p.id === id) || mockProducts[0];
      }
    }),
    getLowStock: build.query<Product[], void>({
      query: () => ({ url: "/api/products/low-stock" }),
      providesTags: ["Product"],
      transformResponse: (response) => {
        // For demo purposes, return mock data
        return mockProducts.filter(p => p.quantity <= (p.lowStockThreshold || 0));
      }
    }),
    getOutOfStock: build.query<Product[], void>({
      query: () => ({ url: "/api/products/out-of-stock" }),
      providesTags: ["Product"],
      transformResponse: (response) => {
        // For demo purposes, return mock data
        return mockProducts.filter(p => p.quantity === 0);
      }
    }),
    createProduct: build.mutation<Product, Partial<Product>>({
      query: (body) => ({ 
        url: "/api/products", 
        method: "POST", 
        body 
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: build.mutation<Product, Partial<Product> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => ["Product", { type: "Product", id: arg.id }],
    }),
    deleteProduct: build.mutation<void, number>({
      query: (id) => ({ 
        url: `/api/products/${id}`, 
        method: "DELETE" 
      }),
      invalidatesTags: ["Product"],
    }),
    uploadImage: build.mutation<{ imageUrl: string }, { productId: number; file: File }>({
      query: ({ productId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/api/products/upload-image/${productId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: "Product", id: arg.productId }],
    }),
    generateBarcode: build.mutation<{ barcode: string }, number>({
      query: (productId) => ({
        url: `/api/products/${productId}/generate-barcode`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetLowStockQuery,
  useGetOutOfStockQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
  useGenerateBarcodeMutation,
} = productsApi;