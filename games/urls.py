from django.conf.urls import patterns, url
from games import views

urlpatterns = patterns('',
	url(r'^(?i)ConnectFour/', views.connectfour, name="ConnectOfek"),
	url(r'^(?i)OnlineGo/', views.weiqi, name="OnlineGo"),
	url(r'^(?i)Mancala/', views.mancala, name="Mancala"),
	url(r'^(?i)UltimateTicTacToe/', views.ultimatetictactoe, name="UltimateTicTacToe"),
)