import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import CategoryListPage from '@/pages/categories/CategoryListPage';
import ProductListPage from '@/pages/products/ProductListPage';
import CustomerListPage from '@/pages/customers/CustomerListPage';
import RentalOrderListPage from '@/pages/rental-orders/RentalOrderListPage';
import RentalOrderDetailPage from '@/pages/rental-orders/RentalOrderDetailPage';
import CreateRentalOrderPage from '@/pages/rental-orders/CreateRentalOrderPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/categories" element={<CategoryListPage />} />

        <Route path="/products" element={<ProductListPage />} />

        <Route path="/customers" element={<CustomerListPage />} />

        <Route path="/rental-orders" element={<RentalOrderListPage />} />
        <Route path="/rental-orders/create" element={<CreateRentalOrderPage />} />
        <Route path="/rental-orders/:id" element={<RentalOrderDetailPage />} />
      </Route>
    </Routes>
  );
}
