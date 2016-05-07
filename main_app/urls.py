from django.conf.urls import patterns, url, include
from main_app import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^', include('main_app.misurls')),
)