from django.conf.urls import url, include
from tools import views

urlpatterns = [
	url(r'^$', views.index, name="Tools Home"),
	url(r'^Maze/$', views.maze, name="Maze Generator"),
	url(r'^PrimeFactorizer/$', views.primefactorizer, name="Prime Factorizer"),
	url(r'^Grapher/$', views.grapher, name="Grapher"),
	url(r'^HappyNumbers/$', views.happynumber, name="Happy Number Calculator"),
	url(r'^ReveresLatsLettesr/$', views.revereslatslettesr, name="Text Reverser"),
	url(r'^ImageEditor/$', views.imageeditor, name="Image Editor"),
	url(r'^PasswordGenerator/$', views.passwordgenerator, name="Password Generator"),
	url(r'^DijkstraAlgorithm/$', views.dijkstraalgorithm, name="Dijkstra Algorithm"),
	url(r'^', include('main_app.misurls')),
]
