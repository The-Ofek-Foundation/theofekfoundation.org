from django.shortcuts import render
from tools import pages

# Create your views here.

def maze(request):
	context_dict = {'page': pages.maze}
	return render(request, 'tools/Maze.html', context_dict)

def primefactorizer(request):
	context_dict = {'page': pages.primefactorizer}
	return render(request, 'tools/PrimeFactorizer.html', context_dict)

def grapher(request):
	context_dict = {'page': pages.grapher}
	return render(request, 'tools/Grapher.html', context_dict)

def happynumber(request):
	context_dict = {'page': pages.happynumber}
	return render(request, 'tools/HappyNumber.html', context_dict)

def revereslatslettesr(request):
	context_dict = {'page': pages.revereslatslettesr}
	return render(request, 'tools/ReveresLatsLettesr.html', context_dict)

def imageeditor(request):
	context_dict = {'page': pages.imageeditor}
	return render(request, 'tools/ImageEditor.html', context_dict)


