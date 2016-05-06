from django.conf.urls import patterns, url, include
from main_app import views
from django.views.generic.base import RedirectView

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^register/(?P<redirect_pathname>.*)$', views.register, name='register'),
	url(r'^login/(?P<redirect_pathname>.*)$', views.user_login, name='login'),
	url(r'^logout/(?P<redirect_pathname>.*)$', views.user_logout, name='logout'),
	url(r'^accounts/password/reset/$', 'django.contrib.auth.views.password_reset', {'post_reset_redirect' : '/accounts/password/reset/done/'}),
    url(r'^accounts/password/reset/done/$', 'django.contrib.auth.views.password_reset_done'),
    url(r'^accounts/password/reset/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 'django.contrib.auth.views.password_reset_confirm', {'post_reset_redirect' : '/accounts/password/done/'}),
    url(r'^accounts/password/done/$', 'django.contrib.auth.views.password_reset_complete'),
	url(r'^', include('main_app.misurls')),
)