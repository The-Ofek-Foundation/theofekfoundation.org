# coding: utf-8

from django.shortcuts import render

from main_app import display_projects
from main_app.pages import get_page


def robots(request):
	return render(request, 'main_app/robots.txt', {}, content_type='text/plain')


def privacy_policy(request):
	return render(request, 'main_app/privacy_policy.html', {})


def index(request):
	context_dict = {
		'page': get_page('Homepage', 'Homepage'),
		'projects': display_projects.projects,
	}
	return render(request, 'main_app/index.html', context_dict)


def page_not_found(request, exception=None):
	return render(request, 'main_app/404.html', {}, status=404)