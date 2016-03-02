from django.conf.urls import patterns, url
from main_app import views
from django.views.generic.base import RedirectView

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^(?i)ConnectFour/$', RedirectView.as_view(url='/games/ConnectFour/', permanent=False), name='ConnectFour'),
	url(r'^(?i)OnlineGo/$', RedirectView.as_view(url='/games/OnlineGo/', permanent=False), name='OnlineGo'),
	url(r'^(?i)Mancala/$', RedirectView.as_view(url='/games/Mancala/', permanent=False), name='Mancala'),
)