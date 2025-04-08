import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '../screens/Elements/LanguageContext';
import Login from '../screens/Login';
// import RegisterScreen from '../screens/RegisterScreen';
import MfaSetup from '../screens/MfaSetup';
import Home from '../screens/Home';


const AppRouter = () => {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mfa-setup" element={<MfaSetup />} />
          {/* <Route path="/register" element={<RegisterScreen />} /> */}
          <Route path="/home" element={<Home />} />
          {/* Add more routes as needed */}
        </Routes>
      </LanguageProvider>
    </Router>
  );
};

export default AppRouter;
