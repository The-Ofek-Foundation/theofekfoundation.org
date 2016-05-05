from django.shortcuts import render

# Create your views here.
def blog(request, pathname):
	page = {
		'full_url': 'http://theofekfoundation.org/blog/',
		'pathname': 'blog/' + pathname,
		'full_description': "TheOfekFoundation's Official Blog!",
		'description': "TheOfekFoundation's Official Blog!",
		'title': 'We Blog',
	}
	context_dict = {'page': page, 'pathname': pathname}
	return render(request, 'blog/index.html', context_dict)