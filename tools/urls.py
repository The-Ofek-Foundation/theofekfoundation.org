from django.urls import path

from tools import views

urlpatterns = [
	path('', views.index, name="Tools Home"),
	path('Maze/', views.maze, name="Maze Generator"),
	path('PrimeFactorizer/', views.primefactorizer, name="Prime Factorizer"),
	path('Grapher/', views.grapher, name="Grapher"),
	path('HappyNumbers/', views.happynumber, name="Happy Number Calculator"),
	path('ReveresLatsLettesr/', views.revereslatslettesr, name="Text Reverser"),
	path('ImageEditor/', views.imageeditor, name="Image Editor"),
	path('PasswordGenerator/', views.passwordgenerator, name="Password Generator"),
	path('DijkstraAlgorithm/', views.dijkstraalgorithm, name="Dijkstra Algorithm"),
]
