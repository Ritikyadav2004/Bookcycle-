import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import BuyerProtectedRoute from './BuyerProtectedRoute';
import SellerProtectedRoute from './SellerProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';

import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import BuyerLayout from '../layouts/BuyerLayout';
import SellerLayout from '../layouts/SellerLayout';
import AdminLayout from '../layouts/AdminLayout';

import PageLoader from '../components/common/PageLoader';

const HomePage = lazy(() => import('../pages/public/HomePage'));
const BrowseBooks = lazy(() => import('../pages/public/BrowseBooks'));
const BookDetails = lazy(() => import('../pages/public/BookDetails'));
const Categories = lazy(() => import('../pages/public/Categories'));
const CategoryDetails = lazy(() => import('../pages/public/CategoryDetails'));
const About = lazy(() => import('../pages/public/About'));
const Contact = lazy(() => import('../pages/public/Contact'));
const InfoPage = lazy(() => import('../pages/public/InfoPage'));
const SearchResults = lazy(() => import('../pages/public/SearchResults'));
const NotFound = lazy(() => import('../pages/public/NotFound'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized'));
const RoleSelector = lazy(() => import('../pages/auth/RoleSelector'));
const BuyerLogin = lazy(() => import('../pages/auth/BuyerLogin'));
const SellerLogin = lazy(() => import('../pages/auth/SellerLogin'));
const BuyerRegister = lazy(() => import('../pages/auth/BuyerRegister'));
const SellerRegister = lazy(() => import('../pages/auth/SellerRegister'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin'));
const BuyerDashboard = lazy(() => import('../pages/buyer/Dashboard'));
const Cart = lazy(() => import('../pages/buyer/Cart'));
const Wishlist = lazy(() => import('../pages/buyer/Wishlist'));
const Checkout = lazy(() => import('../pages/buyer/Checkout'));
const OrderSuccess = lazy(() => import('../pages/buyer/OrderSuccess'));
const BuyerOrders = lazy(() => import('../pages/buyer/Orders'));
const BuyerProfile = lazy(() => import('../pages/buyer/Profile'));
const SellerDashboard = lazy(() => import('../pages/seller/Dashboard'));
const AddBook = lazy(() => import('../pages/seller/AddBook'));
const Listings = lazy(() => import('../pages/seller/Listings'));
const PortalPage = lazy(() => import('../pages/portal/PortalPage'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const UsersManagement = lazy(() => import('../pages/admin/Users'));
const ContentModeration = lazy(() => import('../pages/admin/Content'));
const AdminListings = lazy(() => import('../pages/admin/Listings'));

const withSuspense = (element) => (
  <Suspense fallback={<PageLoader />}>
    {element}
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <PublicLayout />,
        children: [
          { index: true, element: withSuspense(<HomePage />) },
          { path: 'browse', element: withSuspense(<BrowseBooks />) },
          { path: 'book/:id', element: withSuspense(<BookDetails />) },
          { path: 'categories', element: withSuspense(<Categories />) },
          { path: 'categories/:id', element: withSuspense(<CategoryDetails />) },
          { path: 'search', element: withSuspense(<SearchResults />) },
          { path: 'how-it-works', element: withSuspense(<InfoPage />) },
          { path: 'about', element: withSuspense(<About />) },
          { path: 'contact', element: withSuspense(<Contact />) },
          { path: 'faq', element: withSuspense(<InfoPage />) },
          { path: 'privacy', element: withSuspense(<InfoPage />) },
          { path: 'privacy-policy', element: withSuspense(<InfoPage />) },
          { path: 'terms', element: withSuspense(<InfoPage />) },
          { path: 'shipping', element: withSuspense(<InfoPage />) },
          { path: 'shipping-policy', element: withSuspense(<InfoPage />) },
          { path: 'refund', element: withSuspense(<InfoPage />) },
          { path: 'refund-policy', element: withSuspense(<InfoPage />) },
          { path: 'seller-guidelines', element: withSuspense(<InfoPage />) },
          { path: 'unauthorized', element: withSuspense(<Unauthorized />) },
        ]
      },
      {
        path: '/',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: withSuspense(<RoleSelector />) },
          { path: 'buyer/login', element: withSuspense(<BuyerLogin />) },
          { path: 'seller/login', element: withSuspense(<SellerLogin />) },
          { path: 'buyer/register', element: withSuspense(<BuyerRegister />) },
          { path: 'seller/register', element: withSuspense(<SellerRegister />) },
          { path: 'admin/login', element: withSuspense(<AdminLogin />) },
          { path: 'auth/login', element: withSuspense(<RoleSelector />) },
          { path: 'auth/buyer/login', element: withSuspense(<BuyerLogin />) },
          { path: 'auth/seller/login', element: withSuspense(<SellerLogin />) },
          { path: 'auth/admin/login', element: withSuspense(<AdminLogin />) },
          { path: 'forgot-password', element: withSuspense(<ForgotPassword />) },
          { path: 'reset-password', element: withSuspense(<ResetPassword />) },
        ]
      }
    ]
  },
  {
    path: '/buyer',
    element: <BuyerProtectedRoute />,
    children: [
      {
        element: <BuyerLayout />,
        children: [
          { path: 'dashboard', element: withSuspense(<BuyerDashboard />) },
          { path: 'cart', element: withSuspense(<Cart />) },
          { path: 'wishlist', element: withSuspense(<Wishlist />) },
          { path: 'checkout', element: withSuspense(<Checkout />) },
          { path: 'order-success', element: withSuspense(<OrderSuccess />) },
          { path: 'orders', element: withSuspense(<BuyerOrders />) },
          { path: 'order/:id', element: withSuspense(<BuyerOrders />) },
          { path: 'recently-viewed', element: withSuspense(<PortalPage type="buyer-recently-viewed" />) },
          { path: 'recommendations', element: withSuspense(<PortalPage type="buyer-recommendations" />) },
          { path: 'reviews', element: withSuspense(<PortalPage type="buyer-reviews" />) },
          { path: 'notifications', element: withSuspense(<PortalPage type="buyer-notifications" />) },
          { path: 'profile', element: withSuspense(<BuyerProfile />) },
          { path: 'settings', element: withSuspense(<BuyerProfile />) },
        ]
      }
    ]
  },
  {
    path: '/seller',
    element: <SellerProtectedRoute />,
    children: [
      {
        element: <SellerLayout />,
        children: [
          { path: 'dashboard', element: withSuspense(<SellerDashboard />) },
          { path: 'add-book', element: withSuspense(<AddBook />) },
          { path: 'listings', element: withSuspense(<Listings />) },
          { path: 'orders', element: withSuspense(<PortalPage type="seller-orders" />) },
          { path: 'sales', element: withSuspense(<PortalPage type="seller-sales" />) },
          { path: 'transactions', element: withSuspense(<PortalPage type="seller-transactions" />) },
          { path: 'reviews', element: withSuspense(<PortalPage type="seller-reviews" />) },
          { path: 'notifications', element: withSuspense(<PortalPage type="seller-notifications" />) },
          { path: 'profile', element: withSuspense(<PortalPage type="seller-profile" />) },
          { path: 'settings', element: withSuspense(<PortalPage type="seller-settings" />) },
        ]
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: withSuspense(<AdminDashboard />) },
          { path: 'users', element: withSuspense(<UsersManagement />) },
          { path: 'buyers', element: withSuspense(<UsersManagement initialRole="Buyers" />) },
          { path: 'sellers', element: withSuspense(<UsersManagement initialRole="Sellers" />) },
          { path: 'content', element: withSuspense(<ContentModeration />) },
          { path: 'listings', element: withSuspense(<AdminListings />) },
          { path: 'categories', element: withSuspense(<PortalPage type="admin-categories" />) },
          { path: 'orders', element: withSuspense(<PortalPage type="admin-orders" />) },
          { path: 'transactions', element: withSuspense(<PortalPage type="admin-transactions" />) },
          { path: 'reports', element: withSuspense(<PortalPage type="admin-reports" />) },
          { path: 'reviews', element: withSuspense(<PortalPage type="admin-reviews" />) },
          { path: 'notifications', element: withSuspense(<PortalPage type="admin-notifications" />) },
          { path: 'settings', element: withSuspense(<PortalPage type="admin-settings" />) },
        ]
      }
    ]
  },
  {
    path: '*',
    element: withSuspense(<NotFound />)
  }
]);

export default router;
