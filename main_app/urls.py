from django.urls import path
from django.views.generic import TemplateView

from main_app import views

urlpatterns = [
	path('', views.index, name='Homepage'),
	path('robots.txt', views.robots, name='Robots'),
	path('privacy', views.privacy_policy, name='Privacy Policy'),
	path('sitemap.xml', TemplateView.as_view(template_name='main_app/sitemap.xml', content_type='text/xml'), name='Sitemap'),
]