from django.shortcuts import render

# Create your views here.

def connectfour(request):
	page = {
		'full_url': 'http://theofekfoundation.org/games/ConnectFour',
		'full_description': "Connect Four online Monte Carlo AI! Play against human or strong computer! Save your games easily!",
		'description': "Connect Four online Monte Carlo AI!",
		'title': 'Connect Ofek',
	}
	context_dict = {'page': page}
	return render(request, 'games/ConnectOfek.html', context_dict)