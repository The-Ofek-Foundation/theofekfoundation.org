from django.conf.urls import url, include
from main_app import views
from django.views.generic import TemplateView

urlpatterns = [
	url(r'^$', views.index, name='Homepage'),
	url(r'^robots\.txt$', views.robots, name='Robots'),
	url(r'^privacy$', views.privacy_policy, name='Privacy Policy'),
	url(r'^.well-known/acme-challenge/zpPWMwt0xI6SFG1rikEwg-6LFrwDOAyT0Q0H9gFzklk',
		views.acme),
	url(r'^sitemap\.xml$', TemplateView.as_view(template_name='main_app/sitemap.xml', content_type='text/xml')),
	url(r'^', include('main_app.misurls')),
]