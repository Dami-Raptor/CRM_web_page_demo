import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Lead from './pages/Lead';
import Seller from './pages/Seller'
import CompanyStacks from './pages/CompanyStacks';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } 
        />
        <Route 
        path="/company/:id" 
          element={
              <ProtectedRoute>
                  <CompanyStacks /> 
              </ProtectedRoute>
          } 
      />
        <Route 
          path="/leads" element={
            <ProtectedRoute>
              <Lead/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sellers" element={
            <ProtectedRoute>
              <Seller/>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;