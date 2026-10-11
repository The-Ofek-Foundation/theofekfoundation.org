from django.urls import path

from people import views

urlpatterns = [
	path('Edan', views.edan_ben_moshe, name='EBM'),
	path('Ron', views.ron_kibel, name='Ron Kibel'),
]