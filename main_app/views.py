from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
	context_dict = {}
	return render(request, 'main_app/index.html', context_dict)

def page_not_found(request):
	print "PAge NOT FOUND!!!"
	return render(request, 'main_app/index.html', context_dict)