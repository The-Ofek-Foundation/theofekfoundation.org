from django.conf.urls import url
from django.views.generic.base import RedirectView

urlpatterns = [
	url(r'(?i)ConnectFour/$', RedirectView.as_view(url='/games/ConnectFour/', permanent=True)),
	url(r'(?i)OnlineGo/$', RedirectView.as_view(url='/games/OnlineGo/', permanent=True)),
	url(r'(?i)Mancala/$', RedirectView.as_view(url='/games/Mancala/', permanent=True)),
	url(r'(?i)UltimateTicTacToe/$', RedirectView.as_view(url='/games/UltimateTicTacToe/', permanent=True)),
	url(r'(?i)UTTT/$', RedirectView.as_view(url='/games/UltimateTicTacToe/', permanent=True)),
	url(r'(?i)LameDuck/$', RedirectView.as_view(url='/games/LameDuck/', permanent=True)),
	url(r'(?i)OldSnakey/$', RedirectView.as_view(url='/games/OldSnakey/', permanent=True)),
	url(r'(?i)Snake/$', RedirectView.as_view(url='/games/OldSnakey/', permanent=True)),
	url(r'(?i)Minesweeper/$', RedirectView.as_view(url='/games/Minesweeper/', permanent=True)),
	url(r'(?i)DotsAndBoxes/$', RedirectView.as_view(url='/games/DotsAndBoxes/', permanent=True)),
	url(r'(?i)Crossroads/$', RedirectView.as_view(url='/games/Crossroads/', permanent=True)),
	url(r'(?i)Othello/$', RedirectView.as_view(url='/games/Othello/', permanent=True)),
	url(r'(?i)Hangman/$', RedirectView.as_view(url='/games/Hangman/', permanent=True)),
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
	url(r'(?i)DijkstraAlgorithm/$', RedirectView.as_view(url='/tools/DijkstraAlgorithm/', permanent=True)),
	url(r'(?i)login/$', RedirectView.as_view(url='/account/login/', permanent=True)),
	url(r'(?i)username/$', RedirectView.as_view(url='/account/username/', permanent=True)),
	url(r'(?i)logout/$', RedirectView.as_view(url='/account/logout/', permanent=True)),
	url(r'(?i)register/$', RedirectView.as_view(url='/account/register/', permanent=True)),
	url(r'(?i)ResetPassword/$', RedirectView.as_view(url='/account/ResetPassword/', permanent=True)),
	url(r'(?i)blog/$', RedirectView.as_view(url='/blog/', permanent=True)),
	url(r'(?i)games/$', RedirectView.as_view(url='/games/', permanent=True)),
	url(r'(?i)tools/$', RedirectView.as_view(url='/tools/', permanent=True)),
	url(r'(?i)Edan/$', RedirectView.as_view(url='/people/Edan', permanent=True)),
	url(r'(?i)Ron/$', RedirectView.as_view(url='/people/Ron', permanent=True)),
]
