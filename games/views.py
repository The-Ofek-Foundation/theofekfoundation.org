# -*- coding: utf-8 -*-

from django.shortcuts import render
from main_app.models import WebsiteCategory, WebsitePage
from games.models import GameSettings
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from main_app import display_projects
import json

main_category = WebsiteCategory.objects.get(name='Games')
main_pages = WebsitePage.objects.filter(category=main_category)

def index(request):
	context_dict = {
		'page': main_pages.get(name='Games Home'),
		'games': display_projects.games,
	}
	return render(request, 'games/index.html', context_dict)

def _get_game_settings(request, game_name, context_dict):
	if request.user.is_authenticated():
		game_settings = GameSettings.objects.get_or_create(game_name=game_name, user_id=request.user.id)
		context_dict['game_settings'] = json.dumps(game_settings[0].get_settings())
	else:
		context_dict['game_settings'] = {'game_name': game_name}

def connectfour(request):
	context_dict = {'page': main_pages.get(name='Connect Four')}
	_get_game_settings(request, 'Connect Four', context_dict)
	return render(request, 'games/ConnectOfek.html', context_dict)

def weiqi(request):
	context_dict = {'page': main_pages.get(name='Weiqi')}
	return render(request, 'games/OnlineGo.html', context_dict)

def mancala(request):
	context_dict = {'page': main_pages.get(name='Mancala')}
	_get_game_settings(request, 'Mancala', context_dict)
	return render(request, 'games/Mancala.html', context_dict)

def ultimatetictactoe(request):
	context_dict = {'page': main_pages.get(name='Ultimate Tic Tac Toe')}
	_get_game_settings(request, 'Ultimate Tic Tac Toe', context_dict)
	return render(request, 'games/UltimateTicTacToe.html', context_dict)

def lameduck(request):
	context_dict = {'page': main_pages.get(name='Lame Duck')}
	return render(request, 'games/LameDuck.html', context_dict)

def oldsnakey(request):
	context_dict = {'page': main_pages.get(name='Old Snakey')}
	_get_game_settings(request, 'Old Snakey', context_dict)
	return render(request, 'games/OldSnakey.html', context_dict)

def minesweeper(request):
	context_dict = {'page': main_pages.get(name='Minesweeper')}
	_get_game_settings(request, 'Minesweeper', context_dict)
	return render(request, 'games/Minesweeper.html', context_dict)

def dotsandboxes(request):
	context_dict = {'page': main_pages.get(name='Dots and Boxes')}
	_get_game_settings(request, 'Dots and Boxes', context_dict)
	return render(request, 'games/DotsAndBoxes.html', context_dict)

def crossroads(request):
	context_dict = {'page': main_pages.get(name='מפגשים צולבים')}
	_get_game_settings(request, 'מפגשים צולבים', context_dict)
	return render(request, 'games/Crossroads.html', context_dict)

@login_required
def save_settings(request):
	settings = json.loads(request.body)
	GameSettings.objects.filter(game_name=settings['game_name'], user_id=request.user.id).update(**settings)
	return HttpResponse()