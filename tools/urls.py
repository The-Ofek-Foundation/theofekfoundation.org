from django.conf.urls import patterns, url, include
from tools import views

urlpatterns = patterns('',
	url(r'^(?i)Maze/', views.maze, name="Maze"),
	url(r'^(?i)PrimeFactorizer/', views.primefactorizer, name="PrimeFactorizer"),
	url(r'^(?i)Grapher/', views.grapher, name="Grapher"),
	url(r'^', include('main_app.misurls')),
)