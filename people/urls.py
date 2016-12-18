from django.conf.urls import url, include
from people import views

urlpatterns = [
	url(r'^Edan$', views.edan_ben_moshe, name='EBM'),
	url(r'^', include('main_app.misurls')),
]