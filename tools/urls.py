from django.conf.urls import patterns, url
from tools import views

urlpatterns = patterns('',
	url(r'^(?i)Maze/', views.maze, name="Maze"),
)