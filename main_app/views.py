from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
	context_dict = {}
	return render(request, 'main_app/index.html', context_dict)