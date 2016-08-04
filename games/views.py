from django.shortcuts import render
from main_app.models import WebsiteCategory, WebsitePage
from games.models import GameSettings
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
import json

main_category = WebsiteCategory.objects.get(name='Games')
main_pages = WebsitePage.objects.filter(category=main_category)

def index(request):
	context_dict = {'page': main_pages.get(name='Games Home')}
	return render(request, 'games/index.html', context_dict)

def _get_game_settings(request, game_name, context_dict):
	if not request.user.is_authenticated():
		return {}
	game_settings = GameSettings.objects.get_or_create(game_name=game_name, user_id=request.user.id)
	if game_settings[1]:
		context_dict['game_settings'] = {}
	else:
		context_dict['game_settings'] = json.dumps(game_settings[0].get_settings())

def connectfour(request):
	context_dict = {'page': main_pages.get(name='Connect Four')}
	return render(request, 'games/ConnectOfek.html', context_dict)

def weiqi(request):
	context_dict = {'page': main_pages.get(name='Weiqi')}
	return render(request, 'games/OnlineGo.html', context_dict)

def mancala(request):
	context_dict = {'page': main_pages.get(name='Mancala')}
	return render(request, 'games/Mancala.html', context_dict)

def ultimatetictactoe(request):
	context_dict = {'page': main_pages.get(name='Ultimate Tic Tac Toe')}
	_get_game_settings(request, 'Ultimate Tic Tac Toe', context_dict)
	return render(request, 'games/UltimateTicTacToe.html', context_dict)

def lameduck(request):
	context_dict = {'page': main_pages.get(name='Lame Duck')}
	return render(request, 'games/LameDuck.html', context_dict)

@login_required
def save_settings(request):
	settings = json.loads(request.POST['settings'])
	GameSettings.objects.filter(game_name=settings['game_name'], user_id=request.user.id).update(**settings)
	return HttpResponse()