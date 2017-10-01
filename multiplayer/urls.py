from django.conf.urls import url, include
from multiplayer import views

urlpatterns = [
	url(r'^api/set_state/(?P<id>[0-9]+)/?$', views.set_state, name='Set State'),
	url(r'^UltimateTicTacToe/(?P<id>[0-9]*)/?$', views.ultimatetictactoe, name='Multiplayer Ultimate Tic Tac Toe'),
]
