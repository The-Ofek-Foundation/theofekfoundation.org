from django.conf.urls import patterns, url
from projects import views

urlpatterns = patterns('',
	url(r'^ConnectFour/', views.connectfour, name="ConnectOfek"),
)