from django.shortcuts import render

from main_app.models import WebsiteCategory, WebsitePage

main_category = WebsiteCategory.objects.get(name='People')
main_pages = WebsitePage.objects.filter(category=main_category)

# Create your views here.
def edan_ben_moshe(request):
	context_dict = {
		'page': main_pages.get(name='EBM'),
		'person_name': "Edan Ben Moshe",
	}

	return render(request, 'people/edan/edan_page.html', context_dict)
