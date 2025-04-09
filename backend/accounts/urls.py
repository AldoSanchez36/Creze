# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('enable_mfa/', views.enable_mfa, name='enable_mfa'),
    path('confirm_mfa/', views.confirm_mfa, name='confirm_mfa'),
]