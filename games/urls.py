from django.conf.urls import url, include
from games import views

urlpatterns = [
	url(r'^$', views.index, name="Games"),
	url(r'^ConnectFour/', views.connectfour, name="Connect Four"),
	url(r'^OnlineGo/', views.weiqi, name="Weiqi"),
	url(r'^Mancala/', views.mancala, name="Mancala"),
	url(r'^UltimateTicTacToe/', views.ultimatetictactoe, name="Ultimate Tic Tac Toe"),
	url(r'^LameDuck/', views.lameduck, name="Lame Duck"),
	url(r'^api/save_settings/', views.save_settings, name="save_settings"),
	url(r'^', include('main_app.misurls')),
]
