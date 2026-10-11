from django.shortcuts import render

from main_app.pages import get_page


# Create your views here.
def edan_ben_moshe(request):
	context_dict = {
		'page': get_page('People', 'EBM'),
		'person_name': "Edan Ben Moshe",
	}

	return render(request, 'people/edan/edan_page.html', context_dict)

def ron_kibel(request):
	context_dict = {
		'page': get_page('People', 'Ron Kibel'),
		'person_name': "Ron Kibel",
	}

	return render(request, 'people/ron/ron_page.html', context_dict)
