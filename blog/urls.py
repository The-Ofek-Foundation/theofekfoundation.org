from django.conf.urls import patterns, url
from blog import views

urlpatterns = [
	url(r'^(?P<pathname>.*)$', views.blog, name="Blog"),
]