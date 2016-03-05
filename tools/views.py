from django.shortcuts import render

# Create your views here.

def maze(request):
	page = {
		'full_url': 'http://theofekfoundation.org/tools/Maze/',
		'full_description': "Generate a Maze online!",
		'description': "Generate a Maze online!",
		'title': 'We Generate',
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

def grapher(request):
	page = {
		'full_url': 'http://theofekfoundation.org/tools/Grapher/',
		'full_description': "A function grapher with a trace and newtons' method.",
		'description': "A function grapher with a trace and newtons' method.",
		'title': 'We Graph',
	}
	context_dict = {'page': page}
	return render(request, 'tools/Grapher.html', context_dict)

def happynumber(request):
	page = {
		'full_url': 'http://theofekfoundation.org/tools/HappyNumber/',
		'full_description': "A neat tool to calculate happy numbers, and variants.",
		'description': "A neat tool to calculate happy numbers, and variants.",
		'title': 'We Are Happy',
	}
	context_dict = {'page': page}
	return render(request, 'tools/HappyNumber.html', context_dict)

def revereslatslettesr(request):
	page = {
		'full_url': 'http://theofekfoundation.org/tools/ReveresLatsLettesr/',
		'full_description': "Reveres Lats Tow Lettesr fo Worsd.",
		'description': "Reveres Lats Tow Lettesr fo Worsd.",
		'title': 'We Reverse',
	}
	context_dict = {'page': page}
	return render(request, 'tools/ReveresLatsLettesr.html', context_dict)

def imageeditor(request):
	page = {
		'full_url': 'http://theofekfoundation.org/tools/ImageEditor/',
		'full_description': "A neat tool to calculate happy numbers, and variants.",
		'description': "A neat tool to calculate happy numbers, and variants.",
		'title': 'We Are Happy',
	}
	context_dict = {'page': page}
	return render(request, 'tools/ImageEditor.html', context_dict)


