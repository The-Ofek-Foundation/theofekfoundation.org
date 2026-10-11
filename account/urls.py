from django.urls import path

from account import views

urlpatterns = [
	path('register/', views.register, name='Register'),
	path('login/', views.login, name='Login'),
	path('logout/', views.logout, name='Logout'),
	path('username/', views.username, name='Username'),
	path('ResetPassword/', views.reset_password, name='Password Reset'),
	path('PasswordResetEmailSent/', views.password_reset_email_sent, name='Password Reset Email Sent'),
]
