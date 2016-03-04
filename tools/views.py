from django.shortcuts import render

# Create your views here.

def maze(request):
	page = {
		'full_url': 'http://theofekfoundation.org/tools/Maze/',
		'full_description': "Generate a Maze online!",
		'description': "Generate a Maze online!",
		'title': 'Maze Generator',
	}
	context_dict = {'page': page}
	return render(request, 'tools/Maze.html', context_dict)

def primefactorizer(request):
	page = {
		'full_url': 'http://theofekfoundation.org/tools/PrimeFactorizer/',
		'full_description': "A super fast online Prime Factorizer using a sieve.",
		'description': "A super fast online Prime Factorizer using a sieve.",
		'title': 'We Factorize',
	}
	context_dict = {'page': page}
	return render(request, 'tools/PrimeFactorizer.html', context_dict)