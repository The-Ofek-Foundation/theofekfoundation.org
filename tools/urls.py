from django.conf.urls import patterns, url, include
from tools import views

urlpatterns = [
	url(r'^(?i)Maze/$', views.maze, name="Maze Generator"),
	url(r'^(?i)PrimeFactorizer/$', views.primefactorizer, name="Prime Factorizer"),
	url(r'^(?i)Grapher/$', views.grapher, name="Grapher"),
	url(r'^(?i)HappyNumbers/$', views.happynumber, name="Happy Number Calculator"),
	url(r'^(?i)ReveresLatsLettesr/$', views.revereslatslettesr, name="Text Reverser"),
	url(r'^(?i)ImageEditor/$', views.imageeditor, name="Image Editor"),
	url(r'^(?i)PasswordGenerator/$', views.passwordgenerator, name="Password Generator"),
	url(r'^', include('main_app.misurls')),
]