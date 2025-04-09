import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './Elements/LanguageContext';
import axios from 'axios';
import '../styles/RegisterScreen.css';

function RegisterScreen() {
  const [error, setError] = useState('');

  const { translations, changeLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Hacer la solicitud de registro
      const response = await axios.post('/auth/register/', {
        username: formData.username.trim(),// Aquí se usa `trim()` para limpiar espacios extras
        email: formData.email.trim(),// Aquí se usa `trim()` para limpiar espacios extras
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 200 || response.status === 201) {
        alert('Usuario registrado exitosamente');
        navigate('/login'); // Redirigir al login después del registro
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg || 'Error al registrar el usuario');
      } else {
        console.error('Error:', error);
        setError('Error del servidor');
      }
    }
  };

  return (
    <div className="register-container">
      
      <form className="register-form" onSubmit={handleSubmit}>
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
        <h1>{translations.register}</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">{translations.username}:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">{translations.email}:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{translations.password}:
          <span className="toggle-password material-icons" 
          onClick={() => setShowPassword(!showPassword)}
          style={{position:'relative',top:'7px',left:'2px'}}>
              {showPassword ? 'visibility' : 'visibility_off'}
          </span>
          </label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'} 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">{translations.confirmPassword}:
            <span className="toggle-password material-icons" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{position:'relative',top:'7px',left:'2px', cursor: 'pointer'}}
            >
              {showConfirmPassword ?  'visibility' : 'visibility_off'}
            </span>
          </label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="register-button">
          {translations.registerButton} 
        </button>
        <br></br>
        <button
            className="back-button"
            onClick={() => navigate('/login')}
          >
            ← {translations.loginButton} 
          </button>
      </form>
    </div>
  );
}

export default RegisterScreen;