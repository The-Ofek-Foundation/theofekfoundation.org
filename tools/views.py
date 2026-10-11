from django.shortcuts import render

from main_app import display_projects
from main_app.pages import get_page


def _page(name):
	return get_page('Tools', name)


def index(request):
	context_dict = {
		'page': _page('Tools Home'),
		'tools': display_projects.tools,
	}
	return render(request, 'tools/index.html', context_dict)

def maze(request):
	context_dict = {'page': _page('Maze Generator')}
	return render(request, 'tools/Maze.html', context_dict)

def primefactorizer(request):
	context_dict = {'page': _page('Prime Factorizer')}
	return render(request, 'tools/PrimeFactorizer.html', context_dict)

def passwordgenerator(request):
	context_dict = {'page': _page('Password Generator')}
	return render(request, 'tools/PasswordGenerator.html', context_dict)

def dijkstraalgorithm(request):
	context_dict = {'page': _page('Dijkstra Algorithm')}
	return render(request, 'tools/DijkstraAlgorithm.html', context_dict)

def grapher(request):
	context_dict = {'page': _page('Grapher')}
	return render(request, 'tools/Grapher.html', context_dict)

def happynumber(request):
	context_dict = {'page': _page('Happy Number Calculator')}
	return render(request, 'tools/HappyNumber.html', context_dict)

def revereslatslettesr(request):
	context_dict = {'page': _page('Text Reverser')}
	return render(request, 'tools/ReveresLatsLettesr.html', context_dict)

def imageeditor(request):
	context_dict = {'page': _page('Image Editor')}
	return render(request, 'tools/ImageEditor.html', context_dict)
