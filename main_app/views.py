# coding: utf-8

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from main_app.forms import UserForm, UserProfileForm
from django.template import RequestContext
from main_app import pages, display_projects

# Create your views here.
def index(request):
	context = RequestContext(request)
	context_dict = {
		'page': pages.index,
		'projects': display_projects.projects,
	}
	return render(request, 'main_app/index.html', context_dict)

def page_not_found(request):
	context = RequestContext(request)
	context_dict = {}
	return render(request, 'main_app/404.html', context_dict)