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
            # Temporarily login the user so django_otp can access OTP devices
            login(request, user)

            for device in devices_for_user(user):
                if device.verify_token(otp_token):
                    return JsonResponse({'status': 'logged_in_with_mfa'})
            
            # If user has OTP devices but no valid token provided
            if any(devices_for_user(user)):
                logout(request)
                return JsonResponse({'status': 'mfa_required_or_invalid_token'}, status=401)

            # If no MFA is set up, proceed
            return JsonResponse({'status': 'logged_in_without_mfa'})
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
