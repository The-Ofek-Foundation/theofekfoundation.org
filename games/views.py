from django.shortcuts import render
from main_app.models import WebsiteCategory, WebsitePage

main_category = WebsiteCategory.objects.get(name='Games')
main_pages = WebsitePage.objects.filter(category=main_category)

def index(request):
	context_dict = {'page': main_pages.get(name='Games Home')}
	return render(request, 'games/index.html', context_dict)

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
	return render(request, 'games/UltimateTicTacToe.html', context_dict)

def lameduck(request):
	context_dict = {'page': main_pages.get(name='Lame Duck')}
	return render(request, 'games/LameDuck.html', context_dict)

