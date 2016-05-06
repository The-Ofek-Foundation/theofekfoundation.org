from django.conf.urls import patterns, url, include
from main_app import views
# from views import PasswordResetConfirmView, ResetPasswordRequestView

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^register/(?P<redirect_pathname>.*)$', views.register, name='register'),
	url(r'^login/(?P<redirect_pathname>.*)$', views.user_login, name='login'),
	url(r'^logout/(?P<redirect_pathname>.*)$', views.user_logout, name='logout'),
	url(r'^account/reset_password_confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', PasswordResetConfirmView.as_view(),name='reset_password_confirm'),
	url(r'^account/reset_password', ResetPasswordRequestView.as_view(), name="reset_password"),
	url(r'^', include('main_app.misurls')),
)