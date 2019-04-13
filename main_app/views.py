# coding: utf-8

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from main_app.forms import UserForm
from django.template import RequestContext
from main_app import display_projects
from main_app.models import WebsiteCategory, WebsitePage
from datetime import datetime

main_category = WebsiteCategory.objects.get(name='Homepage')
main_pages = WebsitePage.objects.filter(category=main_category)

def acme(request):
	return HttpResponse('zpPWMwt0xI6SFG1rikEwg-6LFrwDOAyT0Q0H9gFzklk.JwDKEBUh3VbU4jzMSxoWpfmQnEDjBhiLtUMOXzxqmOc')

def robots(request):
	return render(request, 'main_app/robots.txt', {})

# Create your views here.
def index(request):
	context = RequestContext(request)

	visits = request.session.get('visits')
	if not visits:
		visits = 1

	reset_last_visit_time = False

	last_visit = request.session.get('last_visit')
	if last_visit:
		last_visit_time = datetime.strptime(last_visit[:-7], "%Y-%m-%d %H:%M:%S")

		if (datetime.now() - last_visit_time).seconds > 0:
			visits += 1
			reset_last_visit_time = True
	else:
		reset_last_visit_time = True

	if reset_last_visit_time:
		request.session['last_visit'] = str(datetime.now())
		request.session['visits'] = visits

	context_dict = {
		'page': main_pages.get(name='Homepage'),
		'projects': display_projects.projects,
	}
	return render(request, 'main_app/index.html', context_dict)

def page_not_found(request):
	context = RequestContext(request)
	context_dict = {}
	return render(request, 'main_app/404.html', context_dict)