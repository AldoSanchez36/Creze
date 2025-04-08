from django.shortcuts import render
# Create your views here.
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.decorators import login_required
from django_otp import devices_for_user
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework_simplejwt.tokens import RefreshToken
import base64
import qrcode
from io import BytesIO


@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'This email is already in use'}, status=400)

        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({'error': e.messages}, status=400)

        user = User.objects.create_user(username=email, email=email, password=password) 
        return JsonResponse({'status': 'registered'})

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('email')
        password = data.get('password')
        otp_token = data.get('otp_token')  # Might be None

        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)

            # Check for OTP devices
            otp_devices = list(devices_for_user(user))
            if otp_devices:
                for device in otp_devices:
                    if device.verify_token(otp_token):
                        login(request, user)
                        return JsonResponse({
                            'status': 'logged_in_with_mfa',
                            'token': token,
                            'email': user.email
                        })
                return JsonResponse({'status': 'mfa_required_or_invalid_token'}, status=401)
            else:
                login(request, user)
                return JsonResponse({
                    'status': 'logged_in_without_mfa',
                    'token': token,
                    'email': user.email
                })
        else:
            return JsonResponse({'status': 'invalid_credentials'}, status=401)

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'status': 'logged_out'})


@csrf_exempt
@login_required
def confirm_mfa(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        token = data.get('otp_token')
        user = request.user

        if not token:
            return JsonResponse({'error': 'OTP token is required'}, status=400)

        device = TOTPDevice.objects.filter(user=user, confirmed=False).first()
        if not device:
            return JsonResponse({'error': 'No unconfirmed MFA device found'}, status=404)

        if device.verify_token(token):
            device.confirmed = True
            device.save()
            return JsonResponse({'status': 'mfa_confirmed'})
        else:
            return JsonResponse({'error': 'Invalid OTP token'}, status=400)

@csrf_exempt
@login_required
def enable_mfa(request):
    user = request.user

    # Check if device already exists and is confirmed
    if TOTPDevice.objects.filter(user=user, confirmed=True).exists():
        return JsonResponse({'error': 'MFA already enabled'}, status=400)

    # Create or get an unconfirmed device
    device, created = TOTPDevice.objects.get_or_create(user=user, confirmed=False, name="default")

    # Generate QR code for the TOTP URI
    otp_uri = device.config_url
    qr = qrcode.make(otp_uri)
    buffered = BytesIO()
    qr.save(buffered, format="PNG")
    qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()

    return JsonResponse({
        'otp_uri': otp_uri,
        'qr_code_base64': qr_code_base64
    })
