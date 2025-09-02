// // 

// import React from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import PrivateRoute from '../features/auth/PrivateRoute';
// import AppLayout from '../features/layout/AppLayout';
// import DashboardPage from '../features/dashboard/DashboardPage';
// import ProductsPage from '../features/products/ProductsPage';
// import EditProductPage from '../features/products/EditProductPage'; // Use the same component
// import ReportsPage from '../features/reports/ReportsPage';
// import SuppliersPage from '../features/suppliers/SuppliersPage';
// import UsersPage from '../features/users/UsersPage';
// import LoginPage from '../features/auth/LoginPage';
// import BarcodeScannerPage from '../features/products/BarcodeScannerPage';

// const router = createBrowserRouter([
//   {
//     path: '/login',
//     element: <LoginPage />,
//   },
//   {
//     element: <PrivateRoute />,
//     children: [
//       {
//         element: <AppLayout />,
//         children: [
//           {
//             path: '/',
//             element: <DashboardPage />,
//           },
//           {
//             path: '/products',
//             element: <ProductsPage />,
//           },
//           {
//             path: '/products/new', // This will use the same component
//             element: <EditProductPage />,
//           },
//           {
//             path: '/products/:id/edit',
//             element: <EditProductPage />,
//           },
//           {
//             path: '/reports',
//             element: <ReportsPage />,
//           },
//           {
//             path: '/suppliers',
//             element: <SuppliersPage />,
//           },
//           {
//             path: '/users',
//             element: <UsersPage />,
//           },
//           {
//             path: '/scan',
//             element: <BarcodeScannerPage />,
//           },
//           {
//             path: '/barcode-scanner',
//             element: <BarcodeScannerPage />,
//           }
//         ],
//       },
//     ],
//   },
// ]);

// const AppRouter: React.FC = () => {
//   return <RouterProvider router={router} />;
// };

// export default AppRouter;


import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoute from '../features/auth/PrivateRoute';
import AppLayout from '../features/layout/AppLayout';
import DashboardPage from '../features/dashboard/DashboardPage';
import ProductsPage from '../features/products/ProductsPage';
import EditProductPage from '../features/products/EditProductPage';
import ReportsPage from '../features/reports/ReportsPage';
import SuppliersPage from '../features/suppliers/SuppliersPage';
import UsersPage from '../features/users/UsersPage';
import LoginPage from '../features/auth/LoginPage';
//import FullPageBarcodeScanner from '../features/products/FullPageBarcodeScanner'; // Import the new component

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <DashboardPage />,
          },
          {
            path: '/products',
            element: <ProductsPage />,
          },
          {
            path: '/products/new',
            element: <EditProductPage />,
          },
          {
            path: '/products/:id/edit',
            element: <EditProductPage />,
          },
          {
            path: '/reports',
            element: <ReportsPage />,
          },
          {
            path: '/suppliers',
            element: <SuppliersPage />,
          },
          {
            path: '/users',
            element: <UsersPage />,
          },
          // {
          //   path: '/barcode-scanner',
          //   element: <FullPageBarcodeScanner />, // Use the new component
          // }
        ],
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
