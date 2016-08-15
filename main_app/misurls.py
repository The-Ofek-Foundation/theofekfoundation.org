from django.conf.urls import patterns, url
from django.views.generic.base import RedirectView

urlpatterns = [
	url(r'(?i)ConnectFour/$', RedirectView.as_view(url='/games/ConnectFour/', permanent=True)),
	url(r'(?i)OnlineGo/$', RedirectView.as_view(url='/games/OnlineGo/', permanent=True)),
	url(r'(?i)Mancala/$', RedirectView.as_view(url='/games/Mancala/', permanent=True)),
	url(r'(?i)UltimateTicTacToe/$', RedirectView.as_view(url='/games/UltimateTicTacToe/', permanent=True)),
	url(r'(?i)LameDuck/$', RedirectView.as_view(url='/games/LameDuck/', permanent=True)),
	url(r'(?i)Maze/$', RedirectView.as_view(url='/tools/Maze/', permanent=True)),
	url(r'(?i)PrimeFactorizer/$', RedirectView.as_view(url='/tools/PrimeFactorizer/', permanent=True)),
	url(r'(?i)PasswordGenerator/$', RedirectView.as_view(url='/tools/PasswordGenerator/', permanent=True)),
	url(r'(?i)Grapher/$', RedirectView.as_view(url='/tools/Grapher/', permanent=True)),
	url(r'(?i)HappyNumbers/$', RedirectView.as_view(url='/tools/HappyNumbers/', permanent=True)),
	url(r'(?i)ReveresLatsLettesr/$', RedirectView.as_view(url='/tools/ReveresLatsLettesr/', permanent=True)),
	url(r'(?i)ReveresLatsLettre/$', RedirectView.as_view(url='/tools/ReveresLatsLettesr/', permanent=True)),
	url(r'(?i)ReverseLastLetter/$', RedirectView.as_view(url='/tools/ReveresLatsLettesr/', permanent=True)),
	url(r'(?i)ReverseLastLetters/$', RedirectView.as_view(url='/tools/ReveresLatsLettesr/', permanent=True)),
	url(r'(?i)ImageEditor/$', RedirectView.as_view(url='/tools/ImageEditor/', permanent=True)),
	url(r'(?i)login/$', RedirectView.as_view(url='/account/login/', permanent=True)),
	url(r'(?i)logout/$', RedirectView.as_view(url='/account/logout/', permanent=True)),
	url(r'(?i)register/$', RedirectView.as_view(url='/account/register/', permanent=True)),
	url(r'(?i)reset_password/$', RedirectView.as_view(url='/account/reset_password/', permanent=True)),
	url(r'(?i)blog/$', RedirectView.as_view(url='/blog/', permanent=True)),
	url(r'(?i)games/$', RedirectView.as_view(url='/games/', permanent=True)),
	url(r'(?i)tools/$', RedirectView.as_view(url='/tools/', permanent=True)),
]
