# -*- coding: utf-8 -*-

from django.urls import path

from games import views

urlpatterns = [
	path('', views.index, name="Games"),
	path('ConnectFour/', views.connectfour, name="Connect Four"),
	path('OnlineGo/', views.weiqi, name="Weiqi"),
	path('Mancala/', views.mancala, name="Mancala"),
	path('UltimateTicTacToe/', views.ultimatetictactoe, name="Ultimate Tic Tac Toe"),
	path('LameDuck/', views.lameduck, name="Lame Duck"),
	path('OldSnakey/', views.oldsnakey, name="Old Snakey"),
	path('Minesweeper/', views.minesweeper, name="Minesweeper"),
	path('DotsAndBoxes/', views.dotsandboxes, name="Dots and Boxes"),
	path('Crossroads/', views.crossroads, name="מפגשים צולבים"),
	path('Othello/', views.othello, name="Othello"),
	path('Hangman/', views.hangman, name="Hangman"),
]

# The old api/save_settings/ and api/get_hangman_word/ endpoints are gone:
# settings are saved in the browser (and Firestore for signed-in users), and the
# Hangman challenge word is served by a small Firebase function.
