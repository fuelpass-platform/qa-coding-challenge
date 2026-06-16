import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CreateOrderPage } from './pages/CreateOrderPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { OrdersListPage } from './pages/OrdersListPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OrdersListPage />} />
        <Route path="/orders/new" element={<CreateOrderPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Routes>
    </Layout>
  );
}
