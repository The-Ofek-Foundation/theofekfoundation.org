# -*- coding: utf-8 -*-

from django.conf.urls import url, include
from games import views

urlpatterns = [
	url(r'^$', views.index, name="Games"),
	url(r'^ConnectFour/', views.connectfour, name="Connect Four"),
	url(r'^OnlineGo/', views.weiqi, name="Weiqi"),
	url(r'^Mancala/', views.mancala, name="Mancala"),
	url(r'^UltimateTicTacToe/', views.ultimatetictactoe, name="Ultimate Tic Tac Toe"),
	url(r'^LameDuck/', views.lameduck, name="Lame Duck"),
	url(r'^OldSnakey/', views.oldsnakey, name="Old Snakey"),
	url(r'^Minesweeper/', views.minesweeper, name="Minesweeper"),
	url(r'^DotsAndBoxes/', views.dotsandboxes, name="Dots and Boxes"),
	url(r'^Crossroads/', views.crossroads, name=u"מפגשים צולבים"),
	url(r'^Othello/', views.othello, name=u"Othello"),
	url(r'^Hangman/', views.hangman, name=u"Hangman"),
	url(r'^api/save_settings/', views.save_settings, name="save_settings"),
	url(r'^', include('main_app.misurls')),
]
