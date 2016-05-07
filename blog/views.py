from django.shortcuts import render
from blog import pages

# Create your views here.
def blog(request, pathname):
	page = pages.blog
	page['pathname'] += pathname
	context_dict = {'page': page, 'pathname': pathname}
	return render(request, 'blog/index.html', context_dict)