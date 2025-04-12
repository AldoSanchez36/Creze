from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
import json

class AuthTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user('u1', 'u1@example.com', 'StrongPass1$')

    def test_register(self):
        resp = self.client.post(reverse('register'), 
            data=json.dumps({'email':'new@example.com','password':'Abcd1234$5'}), 
            content_type='application/json')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()['status'], 'registered')

    def test_login_without_mfa(self):
        resp = self.client.post(reverse('login'),
            data=json.dumps({'email':'u1','password':'StrongPass1$'}),
            content_type='application/json')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()['status'], 'logged_in_without_mfa')

    # ... add tests for enable_mfa and confirm_mfa