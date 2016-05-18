from django.conf.urls import patterns, url, include
from account import views

urlpatterns = [
	url(r'^(?i)register/(?P<redirect_pathname>.*)$', views.register, name='Register'),
	url(r'^(?i)login/(?P<redirect_pathname>.*)$', views.user_login, name='Login'),
	url(r'^(?i)logout/(?P<redirect_pathname>.*)$', views.user_logout, name='Logout'),
	url(r'^(?i)reset_password/', views.ResetPasswordRequestView.as_view(), name="Password Reset"),
	url(r'^(?i)reset_password_confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', views.PasswordResetConfirmView.as_view(), name='Confirm Password Reset'),
	url(r'^', include('main_app.misurls')),
]
