from django.conf.urls import url
from blog import views

urlpatterns = [
	url(r'^(?P<pathname>.*)$', views.blog, name="Blog"),
]