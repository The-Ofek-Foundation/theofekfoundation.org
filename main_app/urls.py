from django.conf.urls import url, include
from main_app import views
from django.views.generic import TemplateView

urlpatterns = [
	url(r'^$', views.index, name='Homepage'),
	url(r'^.well-known/acme-challenge/8ZLrdj27bGIBNSLdW7mCs0fNGbZ9qF-bHvRjJ_Ay5ag',
			views.acme),
	url(r'^.well-known/acme-challenge/pK5vG9S_04uCpmAiuZAe3LrC9Z4uJZDH3A_r_RDCz5c',
			views.acme2),
	url(r'^sitemap\.xml$', TemplateView.as_view(template_name='main_app/sitemap.xml', content_type='text/xml')),
	url(r'^', include('main_app.misurls')),
]