from django.conf.urls import patterns, url, include
from main_app import views
from django.views.generic.base import RedirectView

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^register/(?P<redirect_pathname>.*)$', views.register, name='register'),
	url(r'^login/(?P<redirect_pathname>.*)$', views.user_login, name='login'),
	url(r'^logout/(?P<redirect_pathname>.*)$', views.user_logout, name='logout'),
	url(r'^', include('main_app.misurls')),
)