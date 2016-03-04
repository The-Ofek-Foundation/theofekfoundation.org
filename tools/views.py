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