import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Services from './pages/Services';
import Applications from './pages/Applications';
import NameChangeForm from './pages/NameChangeForm';
import RPADemo from './pages/RPADemo';
import GuidedFlowPage from './pages/GuidedFlow';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="documents" element={<Documents />} />
            <Route path="services" element={<Services />} />
            <Route path="applications" element={<Applications />} />
            <Route path="electricity" element={<NameChangeForm />} />
            <Route path="gas" element={<NameChangeForm />} />
            <Route path="water" element={<NameChangeForm />} />
            <Route path="property" element={<NameChangeForm />} />
            <Route path="rpa-demo" element={<RPADemo />} />
            <Route path="guided-flow" element={<GuidedFlowPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;