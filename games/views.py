from django.shortcuts import render

# Create your views here.

def connectfour(request):
	page = {
		'full_url': 'http://theofekfoundation.org/games/ConnectFour/',
		'full_description': "Connect Four online Monte Carlo AI! Play against human or strong computer! Save your games easily!",
		'description': "Connect Four online Monte Carlo AI!",
		'title': 'Connect Ofek',
	}
	context_dict = {'page': page}
	return render(request, 'games/ConnectOfek.html', context_dict)

def weiqi(request):
	page = {
		'full_url': 'http://theofekfoundation.org/games/OnlineGo/',
		'full_description': "The online games of Go (Weiqi), Gomoku (with a minimax AI), and Wu, with a strong minimax AI for Gomoku.",
		'description': "Play games in the Go family online!",
		'title': 'We iqi',
	}
	context_dict = {'page': page}
	return render(request, 'games/OnlineGo.html', context_dict)

def mancala(request):
	page = {
		'full_url': 'http://theofekfoundation.org/games/Mancala/',
		'full_description': "Mancala online with a strong Monte Carlo AI computer!",
		'description': "Mancala online with a strong Monte Carlo AI computer!",
		'title': 'Mancala Kalah',
	}
	context_dict = {'page': page}
	return render(request, 'games/Mancala.html', context_dict)

def ultimatetictactoe(request):
	page = {
		'full_url': 'http://theofekfoundation.org/games/UltimateTicTacToe/',
		'full_description': "Play Ultimate Tic Tac Toe online against the computer with a Monte Carlo tree search AI!",
		'description': "Ultimate Tic Tac Toe online with a strong Monte Carlo AI computer!",
		'title': 'Ultimate Tic Tac Toe',
	}
	context_dict = {'page': page}
	return render(request, 'games/UltimateTicTacToe.html', context_dict)

def lameduck(request):
	page = {
		'full_url': 'http://theofekfoundation.org/games/LameDuck/',
		'full_description': "The Lame Duck Game! Eat smaller fish, and watch out from larger ones.",
		'description': "The Lame Duck Game!",
		'title': 'Lame Duck',
	}
	context_dict = {'page': page}
	return render(request, 'games/LameDuck.html', context_dict)

