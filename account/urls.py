from django.conf.urls import url, include
from account import views

urlpatterns = [
	url(r'^register/$', views.register, name='Register'),
	url(r'^login/$', views.user_login, name='Login'),
	url(r'^logout/$', views.user_logout, name='Logout'),
	url(r'^ResetPassword/', views.ResetPasswordRequestView.as_view(), name="Password Reset"),
	url(r'^PasswordResetEmailSent/', views.password_reset_email_sent, name="Password Reset Email Sent"),
	url(r'^ResetPasswordConfirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', views.PasswordResetConfirmView.as_view(), name='Confirm Password Reset'),
	url(r'^', include('main_app.misurls')),
]
