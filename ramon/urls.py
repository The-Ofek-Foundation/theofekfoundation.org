from django.conf.urls import url, include
from ramon import views

urlpatterns = [
	url(r'^api/alumni/verify_image/([0-9]+)$', views.alumni_image, name='API Alumni Image'),
]