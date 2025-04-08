import React, { useState } from 'react';
import { useLanguage } from '../screens/Elements/LanguageContext';
import axios from 'axios';
import '../styles/Login.css'; // Assuming you have a CSS file for styling

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [sessionToken, setSessionToken] = useState(null);
  const { translations, changeLanguage } = useLanguage();

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await axios.post('/auth/login/', {
          email,
          password,
        }, { withCredentials: true });

        const { status, token } = response.data;

        if (status === 'logged_in_without_mfa') {
          localStorage.setItem('token', token);
          localStorage.setItem('puesto', 'user');
          window.location.href = '/home';
        } else if (status === 'mfa_required') {
          setMfaRequired(true);
          setSessionToken(token); // temporary session token for MFA
        } else {
          alert(translations.invalidCredentials);
        }

      } catch (error) {
        if (error.response) {
          alert(error.response.data.msg || translations.invalidCredentials);
        } else {
          console.error('Error en la solicitud:', error);
          alert(translations.serverError || 'Error del servidor');
        }
      }
    } else {
      alert(translations.enterValidCredentials);
    }
  };

  return (
    <div className="login-container">
      
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>🌐
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue="en"
            style={{
              padding: '4px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <option value="en" style={{height:'15px'}}>En</option>
            <option value="es" style={{height:'15px'}}>Es</option>
          </select>
        </div>
        <h1>{translations.login}</h1>
        <form>
          <div className="input-group">
            <label htmlFor="email">{translations.email}:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translations.emailPlaceholder}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">{translations.password}:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={translations.passwordPlaceholder}
            />
          </div>
          <button type="button" onClick={handleLogin}>
            {translations.login}
          </button>
        </form>
        {mfaRequired && (
          <div className="mfa-verification">
            <label htmlFor="otp">{translations.enterOtp || "Enter OTP Code"}:</label>
            <input
              type="text"
              id="otp"
              value={otpToken}
              onChange={(e) => setOtpToken(e.target.value)}
              placeholder="123456"
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  const mfaResponse = await axios.post(
                    'http://localhost:8000/auth/verify_mfa/',
                    { otp_token: otpToken },
                    {
                      headers: { Authorization: `Bearer ${sessionToken}` },
                      withCredentials: true,
                    }
                  );
                  localStorage.setItem('token', mfaResponse.data.token);
                  localStorage.setItem('puesto', 'user');
                  window.location.href = '/home';
                } catch (err) {
                  alert("Invalid OTP code");
                }
              }}
            >
              {translations.verify || "Verify"}
            </button>
          </div>
        )}
        <div className="login-options">
          <button
            className="forgot-password-button"
            onClick={() => window.location.href = '/forgot-password'}
          >
            {translations.forgotPassword}
          </button>
          <button
            className="register-button"
            onClick={() => window.location.href = '/register'}
          >
            {translations.register}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;