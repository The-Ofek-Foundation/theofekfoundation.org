from django.conf.urls import patterns, url, include
from tools import views

urlpatterns = [
	url(r'^Maze/$', views.maze, name="Maze Generator"),
	url(r'^PrimeFactorizer/$', views.primefactorizer, name="Prime Factorizer"),
	url(r'^Grapher/$', views.grapher, name="Grapher"),
	url(r'^HappyNumbers/$', views.happynumber, name="Happy Number Calculator"),
	url(r'^ReveresLatsLettesr/$', views.revereslatslettesr, name="Text Reverser"),
	url(r'^ImageEditor/$', views.imageeditor, name="Image Editor"),
	url(r'^PasswordGenerator/$', views.passwordgenerator, name="Password Generator"),
	url(r'^', include('main_app.misurls')),
]
