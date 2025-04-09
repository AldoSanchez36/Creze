# Backend

## Relevant Files

- **`backend/settings.py`**  
  - `INSTALLED_APPS`:  
    - `django.contrib.*`  
    - `accounts`  
    - `django_otp`  
    - `django_otp.plugins.otp_totp`  
    - `django_otp.plugins.otp_static`  
    - `two_factor`  
    - `corsheaders`  
  - `MIDDLEWARE`:  
    - `corsheaders.middleware.CorsMiddleware`  
    - `django_otp.middleware.OTPMiddleware`  
    - custom password validator middleware  
  - `AUTH_PASSWORD_VALIDATORS`: custom validator enforcing ≥10 characters, uppercase, lowercase, numbers & special chars  
  - `CORS_ALLOWED_ORIGINS`:  
    - `http://localhost:3000`  
  - `CORS_ALLOW_CREDENTIALS`: `True`

- **`accounts/views.py`**  
  - Endpoints:  
    - `register`  
    - `login_view`  
    - `logout_view`  
    - `enable_mfa`  
    - `confirm_mfa`  
  - Uses `TOTPDevice` for MFA, issues JWT via `RefreshToken`, generates QR codes with `qrcode`

- **`accounts/urls.py`**  
  - Routes:  
    - `register/`  
    - `login/`  
    - `logout/`  
    - `enable_mfa/`  
    - `confirm_mfa/`

- **`middlewares/password_validation.py`**  
  - Custom password validator enforcing complexity rules

- **`requirements.txt`**  
  - `Django==5.2`  
  - `django-otp`  
  - `django-two-factor-auth`  
  - `djangorestframework-simplejwt`  
  - `django-cors-headers`  
  - `qrcode`  
  - `Pillow`

## Configuration

- **Database**: SQLite (default)  
- **Authentication**: Django sessions + JWT (SimpleJWT)  
- **CSRF**: API views use `@csrf_exempt`  
- **Protected endpoints**: `@login_required`  
- **JWT settings**: default SimpleJWT access token settings  

