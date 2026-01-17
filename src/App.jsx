import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

import Login from './pages/Login';

// Pages Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminClients from './pages/admin/AdminClient';
import AdminLoans from './pages/admin/AdminLoan';

// Pages Client
import ClientDashboard from './pages/clients/ClientDashboard';
import Catalog from './pages/clients/ClientBooks';
import MyLoans from './pages/clients/ClientLoan';
import Profile from './pages/clients/Client';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<Login />} />

          {/* Routes Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/books" element={
            <ProtectedRoute requireAdmin>
              <AdminBooks />
            </ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute requireAdmin>
              <AdminClients />
            </ProtectedRoute>
          } />
          <Route path="/admin/loans" element={
            <ProtectedRoute requireAdmin>
              <AdminLoans />
            </ProtectedRoute>
          } />

          {/* Routes Client */}
          <Route path="/client/dashboard" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/client/catalog" element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          } />
          <Route path="/client/my-loans" element={
            <ProtectedRoute>
              <MyLoans />
            </ProtectedRoute>
          } />
          <Route path="/client/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;