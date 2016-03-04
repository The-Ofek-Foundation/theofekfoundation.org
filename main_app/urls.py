from django.conf.urls import patterns, url
from main_app import views
from django.views.generic.base import RedirectView

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
)