# -*- coding: utf-8 -*-

from django.shortcuts import render
from main_app.models import WebsiteCategory, WebsitePage
from games.models import GameSettings
from django.http import JsonResponse, HttpResponse, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from main_app import display_projects
from hitcount.models import HitCount
from hitcount.views import HitCountMixin
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

def othello(request):
	context_dict = {'page': main_pages.get(name='Othello')}
	_get_game_settings(request, 'Othello', context_dict)
	return render(request, 'games/Othello.html', context_dict)

def hangman(request):
	context_dict = {'page': main_pages.get(name='Hangman')}
	_get_game_settings(request, 'Hangman', context_dict)
	return render(request, 'games/Hangman.html', context_dict)

def normalize(s):
	replacements = {'ם': 'מ', 'ן': 'נ', 'ץ': 'צ', 'ף': 'פ','ך': 'כ'}
	for k, v in replacements.items():
		s = s.replace(k, v)

	return s.lower()

@csrf_exempt
def get_hangman_word(request):
	if not HitCountMixin.hit_count(request, HitCount.objects.get_for_object(main_pages.get(name='Hangman'))).hit_counted:
		return HttpResponseForbidden(json.dumps({'active_word': 'I need to delay your guesses...', 'text_direction': settings.FINAL_HANGMAN[1]}))

	guesses = json.loads(request.body)['guesses']

	# prevent huge guesses
	if len(guesses) > 10 + len(settings.FINAL_HANGMAN[0]()):
		return HttpResponseForbidden(json.dumps({'active_word': 'come on, don\t be *too* bad', 'text_direction': settings.FINAL_HANGMAN[1]}))

	response = ''
	for c in settings.FINAL_HANGMAN[0]().decode('utf-8'):
		if normalize(c) in guesses or c.isspace():
			response += c
		else:
			response += '`' # placeholder
	return HttpResponse(json.dumps({'active_word': response, 'text_direction': settings.FINAL_HANGMAN[1]}))

@login_required
def save_settings(request):
	settings = json.loads(request.body)
	GameSettings.objects.filter(game_name=settings['game_name'], user_id=request.user.id).update(**settings)
	return HttpResponse()