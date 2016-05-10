from django.conf.urls import patterns, url, include
from games import views

urlpatterns = patterns('',
	url(r'^$', views.index, name="Games"),
	url(r'^(?i)ConnectFour/', views.connectfour, name="ConnectOfek"),
	url(r'^(?i)OnlineGo/', views.weiqi, name="OnlineGo"),
	url(r'^(?i)Mancala/', views.mancala, name="Mancala"),
	url(r'^(?i)UltimateTicTacToe/', views.ultimatetictactoe, name="UltimateTicTacToe"),
	url(r'^(?i)LameDuck/', views.lameduck, name="LameDuck"),
	url(r'^', include('main_app.misurls')),
)