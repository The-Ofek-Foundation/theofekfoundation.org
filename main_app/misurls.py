from django.conf.urls import patterns, url
from django.views.generic.base import RedirectView

urlpatterns = patterns('',
	url(r'^(?i)ConnectFour/$', RedirectView.as_view(url='/games/ConnectFour/', permanent=False), name='ConnectFour'),
	url(r'^(?i)OnlineGo/$', RedirectView.as_view(url='/games/OnlineGo/', permanent=False), name='OnlineGo'),
	url(r'^(?i)Mancala/$', RedirectView.as_view(url='/games/Mancala/', permanent=False), name='Mancala'),
	url(r'^(?i)UltimateTicTacToe/$', RedirectView.as_view(url='/games/UltimateTicTacToe/', permanent=False), name='UltimateTicTacToe'),
	url(r'^(?i)LameDuck/$', RedirectView.as_view(url='/games/LameDuck/', permanent=False), name='LameDuck'),
	url(r'^(?i)Maze/$', RedirectView.as_view(url='/tools/Maze/', permanent=False), name='Maze'),
	url(r'^(?i)PrimeFactorizer/$', RedirectView.as_view(url='/tools/PrimeFactorizer/', permanent=False), name='PrimeFactorizer'),
	url(r'^(?i)Grapher/$', RedirectView.as_view(url='/tools/Grapher/', permanent=False), name='Grapher'),
	url(r'^(?i)HappyNumbers/$', RedirectView.as_view(url='/tools/HappyNumbers/', permanent=False), name='HappyNumbers'),
	url(r'^(?i)ReveresLatsLettesr/$', RedirectView.as_view(url='/tools/ReveresLatsLettesr/', permanent=False), name='ReveresLatsLettesr'),
	url(r'^(?i)ReveresLatsLettre/$', RedirectView.as_view(url='/tools/ReveresLatsLettesr/', permanent=False), name='ReveresLatsLettesr'),
	url(r'^(?i)ReverseLastLetter/$', RedirectView.as_view(url='/tools/ReveresLatsLettesr/', permanent=False), name='ReveresLatsLettesr'),
	url(r'^(?i)ReverseLastLetters/$', RedirectView.as_view(url='/tools/ReveresLatsLettesr/', permanent=False), name='ReveresLatsLettesr'),
	url(r'^(?i)ImageEditor/$', RedirectView.as_view(url='/tools/ImageEditor/', permanent=False), name='ImageEditor'),
	url(r'^(?i)login/$', RedirectView.as_view(url='/account/login/', permanent=False), name='Login'),
	url(r'^(?i)logout/$', RedirectView.as_view(url='/account/logout/', permanent=False), name='Logout'),
	url(r'^(?i)register/$', RedirectView.as_view(url='/account/register/', permanent=False), name='Register'),
	url(r'^(?i)reset_password/$', RedirectView.as_view(url='/account/reset_password/', permanent=False), name='ResetPassword'),
	url(r'^(?i)blog/$', RedirectView.as_view(url='/blog/', permanent=False), name='Blog'),
)