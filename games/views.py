from django.shortcuts import render
from games import pages

def index(request):
	context_dict = {'page': pages.index}
	return render(request, 'games/index.html', context_dict)

def connectfour(request):
	context_dict = {'page': pages.connectfour}
	return render(request, 'games/ConnectOfek.html', context_dict)

def weiqi(request):
	context_dict = {'page': pages.weiqi}
	return render(request, 'games/OnlineGo.html', context_dict)

def mancala(request):
	context_dict = {'page': pages.mancala}
	return render(request, 'games/Mancala.html', context_dict)

def ultimatetictactoe(request):
	context_dict = {'page': pages.ultimatetictactoe}
	return render(request, 'games/UltimateTicTacToe.html', context_dict)

def lameduck(request):
	context_dict = {'page': pages.lameduck}
	return render(request, 'games/LameDuck.html', context_dict)

