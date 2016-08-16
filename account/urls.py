from django.conf.urls import url, include
from account import views

urlpatterns = [
	url(r'^register/$', views.register, name='Register'),
	url(r'^login/$', views.user_login, name='Login'),
	url(r'^logout/$', views.user_logout, name='Logout'),
	url(r'^reset_password/', views.ResetPasswordRequestView.as_view(), name="Password Reset"),
	url(r'^reset_password_confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', views.PasswordResetConfirmView.as_view(), name='Confirm Password Reset'),
	url(r'^', include('main_app.misurls')),
]
