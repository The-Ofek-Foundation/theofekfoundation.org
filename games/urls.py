from django.conf.urls import patterns, url
from games import views

urlpatterns = patterns('',
	url(r'^(?i)ConnectFour/', views.connectfour, name="ConnectOfek"),
)