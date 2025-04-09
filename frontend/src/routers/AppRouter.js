import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '../screens/Elements/LanguageContext';
import Login from '../screens/Login';
import MfaSetup from '../screens/MfaSetup';
import Home from '../screens/Home';
import RegisterScreen from '../screens/RegisterScreen';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route
            path="/enable-mfa"
            element={
              <ProtectedRoute>
                <MfaSetup />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
};

export default AppRouter;
