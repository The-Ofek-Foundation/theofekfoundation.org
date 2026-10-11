# -*- coding: utf-8 -*-

import json

from django.shortcuts import render

from main_app import display_projects
from main_app.pages import get_page


def _page(name):
	return get_page('Games', name)


def _game_context(page_name, game_name):
	"""Context for a game page with the settings bootstrap (see games/_base.html).

	Settings start as just the game name; the browser fills in anything saved
	(localStorage, or Firestore for signed-in users).
	"""
	return {
		'page': _page(page_name),
		'game_settings': json.dumps({'game_name': game_name}),
	}


def index(request):
	context_dict = {
		'page': _page('Games Home'),
		'games': display_projects.games,
	}
	return render(request, 'games/index.html', context_dict)


def connectfour(request):
	return render(request, 'games/ConnectOfek.html', _game_context('Connect Four', 'Connect Four'))


def weiqi(request):
	context_dict = {'page': _page('Weiqi')}
	return render(request, 'games/OnlineGo.html', context_dict)


def mancala(request):
	return render(request, 'games/Mancala.html', _game_context('Mancala', 'Mancala'))


def ultimatetictactoe(request):
	return render(request, 'games/UltimateTicTacToe.html', _game_context('Ultimate Tic Tac Toe', 'Ultimate Tic Tac Toe'))


def lameduck(request):
	context_dict = {'page': _page('Lame Duck')}
	return render(request, 'games/LameDuck.html', context_dict)


def oldsnakey(request):
	return render(request, 'games/OldSnakey.html', _game_context('Old Snakey', 'Old Snakey'))


def minesweeper(request):
	return render(request, 'games/Minesweeper.html', _game_context('Minesweeper', 'Minesweeper'))


def dotsandboxes(request):
	return render(request, 'games/DotsAndBoxes.html', _game_context('Dots and Boxes', 'Dots and Boxes'))


def crossroads(request):
	return render(request, 'games/Crossroads.html', _game_context('מפגשים צולבים', 'מפגשים צולבים'))


def othello(request):
	return render(request, 'games/Othello.html', _game_context('Othello', 'Othello'))


def hangman(request):
	return render(request, 'games/Hangman.html', _game_context('Hangman', 'Hangman'))