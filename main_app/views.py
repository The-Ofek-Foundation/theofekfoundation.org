from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
	page = {
		'full_url': 'http://theofekfoundation.org',
		'full_description': "Ofek Gila's website with many game AIs and online tools",
		'description': "Ofek Gila's main website",
		'title': 'We are Ofek',
	}
	context_dict = {'page': page}
	return render(request, 'main_app/index.html', context_dict)

def page_not_found(request):
	context_dict = {}
	return render(request, 'main_app/404.html', context_dict)