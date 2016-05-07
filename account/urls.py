from django.conf.urls import patterns, url, include
from account import views

urlpatterns = patterns('',
	url(r'^register/(?P<redirect_pathname>.*)$', views.register, name='register'),
	url(r'^login/(?P<redirect_pathname>.*)$', views.user_login, name='login'),
	url(r'^logout/(?P<redirect_pathname>.*)$', views.user_logout, name='logout'),
	url(r'^reset_password/', views.ResetPasswordRequestView.as_view(), name="reset_password"),
	url(r'^reset_password_confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', views.PasswordResetConfirmView.as_view(),name='reset_password_confirm'),
	url(r'^', include('main_app.misurls')),
)
