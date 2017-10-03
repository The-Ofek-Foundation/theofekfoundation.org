from django.shortcuts import render
from main_app.models import WebsiteCategory, WebsitePage
from main_app import display_projects

main_category = WebsiteCategory.objects.get(name='Tools')
main_pages = WebsitePage.objects.filter(category=main_category)

def index(request):
	context_dict = {
		'page': main_pages.get(name='Tools Home'),
		'tools': display_projects.tools,
	}
	return render(request, 'tools/index.html', context_dict)

def maze(request):
	context_dict = {'page': main_pages.get(name='Maze Generator')}
	return render(request, 'tools/Maze.html', context_dict)

def primefactorizer(request):
	context_dict = {'page': main_pages.get(name='Prime Factorizer')}
	return render(request, 'tools/PrimeFactorizer.html', context_dict)

def passwordgenerator(request):
	context_dict = {'page': main_pages.get(name='Password Generator')}
	return render(request, 'tools/PasswordGenerator.html', context_dict)

def dijkstraalgorithm(request):
	context_dict = {'page': main_pages.get(name='Dijkstra Algorithm')}
	return render(request, 'tools/DijkstraAlgorithm.html', context_dict)

def grapher(request):
	context_dict = {'page': main_pages.get(name='Grapher')}
	return render(request, 'tools/Grapher.html', context_dict)

def happynumber(request):
	context_dict = {'page': main_pages.get(name='Happy Number Calculator')}
	return render(request, 'tools/HappyNumber.html', context_dict)

def revereslatslettesr(request):
	context_dict = {'page': main_pages.get(name='Text Reverser')}
	return render(request, 'tools/ReveresLatsLettesr.html', context_dict)

def imageeditor(request):
	context_dict = {'page': main_pages.get(name='Image Editor')}
	return render(request, 'tools/ImageEditor.html', context_dict)


