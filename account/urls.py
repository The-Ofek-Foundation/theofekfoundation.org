from django.urls import path

from account import views

# These pages become Firebase Authentication pages in Phase 3c of the migration.
# Until then they render a placeholder, so templates that link to them by name
# (e.g. {% url 'Login' %}) keep working.
urlpatterns = [
	path('register/', views.placeholder, name='Register'),
	path('login/', views.placeholder, name='Login'),
	path('logout/', views.placeholder, name='Logout'),
	path('username/', views.placeholder, name='Username'),
	path('ResetPassword/', views.placeholder, name='Password Reset'),
	path('PasswordResetEmailSent/', views.placeholder, name='Password Reset Email Sent'),
]
