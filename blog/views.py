from django.shortcuts import render
from main_app.models import WebsiteCategory, WebsitePage

main_category = WebsiteCategory.objects.get(name='Blog')
main_pages = WebsitePage.objects.filter(category=main_category)

def blog(request, pathname):
	page = to_dict(main_pages.get(name='Blog'))
	page['pathname'] += pathname
	context_dict = {'page': page, 'pathname': pathname}
	return render(request, 'blog/index.html', context_dict)

from django.db.models.fields.related import ManyToManyField

def to_dict(instance):
	opts = instance._meta
	data = {}
	for f in opts.concrete_fields + opts.many_to_many:
		if isinstance(f, ManyToManyField):
			if instance.pk is None:
				data[f.name] = []
			else:
				data[f.name] = list(f.value_from_object(instance).values_list('pk', flat=True))
		else:
			data[f.name] = f.value_from_object(instance)
	return data