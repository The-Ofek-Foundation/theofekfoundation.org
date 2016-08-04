from django.conf.urls import patterns, url, include
from games import views

urlpatterns = [
	url(r'^$', views.index, name="Games"),
	url(r'^(?i)ConnectFour/', views.connectfour, name="Connect Four"),
	url(r'^(?i)OnlineGo/', views.weiqi, name="Weiqi"),
	url(r'^(?i)Mancala/', views.mancala, name="Mancala"),
	url(r'^(?i)UltimateTicTacToe/', views.ultimatetictactoe, name="Ultimate Tic Tac Toe"),
	url(r'^(?i)LameDuck/', views.lameduck, name="Lame Duck"),
	url(r'^(?i)api/save_settings/', views.save_settings, name="save_settings"),
	url(r'^', include('main_app.misurls')),
]