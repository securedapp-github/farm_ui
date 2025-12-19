import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import VerifyPage from './pages/public/VerifyPage';

// Dashboard Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import BatchesPage from './pages/dashboard/BatchesPage';
import CreateBatchPage from './pages/dashboard/CreateBatchPage';
import BatchDetailPage from './pages/dashboard/BatchDetailPage';
import AddEventPage from './pages/dashboard/AddEventPage';
import BatchSplitPage from './pages/dashboard/BatchSplitPage';
import TransferPage from './pages/dashboard/TransferPage';
import QRManagementPage from './pages/dashboard/QRManagementPage';
import QRScannerPage from './pages/dashboard/QRScannerPage';
import EventsPage from './pages/dashboard/EventsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import ProfilePage from './pages/dashboard/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />

            {/* Batch Management */}
            <Route path="batches" element={<BatchesPage />} />
            <Route path="batches/create" element={<CreateBatchPage />} />
            <Route path="batches/:id" element={<BatchDetailPage />} />
            <Route path="batches/:id/add-event" element={<AddEventPage />} />
            <Route path="batches/:id/split" element={<BatchSplitPage />} />
            <Route path="transfer" element={<TransferPage />} />

            {/* QR Code Management */}
            <Route path="qr" element={<QRManagementPage />} />
            <Route path="qr/scan" element={<QRScannerPage />} />

            {/* Placeholder routes - using DashboardHome as fallback */}
            <Route path="events" element={<EventsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
