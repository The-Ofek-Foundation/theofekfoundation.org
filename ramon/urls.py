from django.conf.urls import url, include
from ramon import views

urlpatterns = [
	url(r'api/alumni/image^$', views.alumni_image, name='API Alumni Image'),
]