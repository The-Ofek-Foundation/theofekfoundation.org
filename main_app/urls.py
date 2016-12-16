from django.conf.urls import url, include
from main_app import views
from django.views.generic import TemplateView

urlpatterns = [
	url(r'^$', views.index, name='Homepage'),
	url(r'^Edan$', views.edan_page, name='EBM'),
	url(r'^sitemap\.xml$', TemplateView.as_view(template_name='main_app/sitemap.xml', content_type='text/xml')),
	url(r'^', include('main_app.misurls')),
]