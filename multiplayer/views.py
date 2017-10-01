from django.shortcuts import render
from main_app.models import WebsiteCategory, WebsitePage
from multiplayer.models import MultiplayerGame
from games.views import _get_game_settings
from django.http import HttpResponse

import json

main_category = WebsiteCategory.objects.get(name='Multiplayer')
main_pages = WebsitePage.objects.filter(category=main_category)

def _get_new_game(request, game_name, context_dict, id=False):
	if id: # find pre-existing game
		game = MultiplayerGame.objects.get(id=id)
		game_settings = game.game_settings
		context_dict['game_settings'] = json.dumps(game_settings.get_settings())
		state = game.state
		context_dict['game_state'] = json.dumps(state)
	else:
		if request.user.is_authenticated(): # generate new game
			game_settings = _get_game_settings(request, game_name, context_dict)
			game = MultiplayerGame.objects.create(owner=request.user,
				game_settings=game_settings)
			id = game.id
			context_dict['new_game'] = True

	context_dict['game_id'] = id


def ultimatetictactoe(request, id=False):
	context_dict = {
		'page': main_pages.get(name='Multiplayer Ultimate Tic Tac Toe'),
		'multiplayer': True,
	}
	_get_new_game(request, 'Ultimate Tic Tac Toe', context_dict, id)
	return render(request, 'games/UltimateTicTacToe.html', context_dict)

def set_state(request, id):
	settings = {
		'state': json.loads(request.body),
	}
	MultiplayerGame.objects.filter(id=id).update(**settings)
	return HttpResponse()
