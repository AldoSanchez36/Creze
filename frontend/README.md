# Frontend

## Relevant Files

- **`package.json`**  
  - `"proxy": "http://localhost:8000"`  
  - dependencies: `react`, `react-dom`, `react-router-dom`, `axios`

- **`src/index.js`**  
  - Renders `<AppRouter />` inside `<BrowserRouter>`

- **`src/routers/AppRouter.js`**  
  - Routes:  
    - `/login` → `Login.jsx`  
    - `/register` → `RegisterScreen.jsx`  
    - `/enable-mfa` → `MfaSetup.jsx` (protected)  
    - `/home` → `Home.jsx` (protected)  
  - `<ProtectedRoute>` checks `localStorage.getItem('token')`

- **`src/screens/Login.jsx`**  
  - Login form with email/password and OTP flow  
  - Axios calls with `withCredentials: true`

- **`src/screens/RegisterScreen.jsx`**  
  - Registration form, posts to `/auth/register/`

- **`src/screens/MfaSetup.jsx`**  
  - Calls `/auth/enable_mfa/`, displays `qr_code_base64` as QR image

- **`src/screens/Home.jsx`**  
  - Protected home page after successful MFA

- **`src/screens/Elements/LanguageContext.js`**  
  - React Context for English/Spanish translations

- **`src/styles/`**  
  - CSS files for each screen (e.g. `Login.css`, `RegisterScreen.css`, etc.)

## Configuration

- **Axios**: uses proxy in `package.json` for base URL, `withCredentials: true`  
- **Routing**: React Router v6  
- **State**: React `useState` and Context API for language  
- **Build**: `npm run build` for production, `npm start` for development  