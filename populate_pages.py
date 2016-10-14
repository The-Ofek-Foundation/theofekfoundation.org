import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TheOfekFoundation.settings")
import django
django.setup()

from main_app.models import WebsiteCategory, WebsitePage

def populate():
	category = add_category('Homepage')

	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org',
		pathname = '',
		full_description = "Ofek Gila's website with many game AIs and online tools",
		description = "Ofek Gila's main website",
		title = 'We are Ofek',
		name = 'Homepage',
	)

	category = add_category('Blog')

	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/blog/',
		pathname = 'blog/',
		full_description = "TheOfekFoundation's Official Blog!",
		description = "TheOfekFoundation's Official Blog!",
		title = 'We Blog',
		name = 'Blog',
	)

	category = add_category('Games')

	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/games/',
		pathname = 'games/',
		full_description = "Play games on TheOfekFoundation! Either two player, or against the (very powerful) AIs!",
		description = "Play games on TheOfekFoundation!",
		title = 'We Play',
		name = 'Games',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/games/ConnectFour/',
		pathname = 'games/ConnectFour/',
		full_description = "Connect Four online Monte Carlo AI! Play against human or strong computer! Save your games easily!",
		description = "Connect Four online Monte Carlo AI!",
		title = 'Connect Ofek',
		name = 'Connect Four',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/games/OnlineGo/',
		pathname = 'games/OnlineGo/',
		full_description = "The online games of Go (Weiqi), Gomoku (with a minimax AI), and Wu, with a strong minimax AI for Gomoku.",
		description = "Play games in the Go family online!",
		title = 'We iqi',
		name = 'Weiqi',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/games/Mancala/',
		pathname = 'games/Mancala/',
		full_description = "Mancala online with a strong Monte Carlo AI computer!",
		description = "Mancala online with a strong Monte Carlo AI computer!",
		title = 'Mancala Kalah',
		name = 'Mancala',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/games/UltimateTicTacToe/',
		pathname = 'games/UltimateTicTacToe/',
		full_description = "Play Ultimate Tic Tac Toe online against the computer with a Monte Carlo tree search AI! This is currently the strongest Ultimate Tic Tac Toe bot, AI, computer, out there, by far!",
		description = "Ultimate Tic Tac Toe online with a strong Monte Carlo AI computer!",
		title = 'Ultimate Tic Tac Toe',
		name = 'Ultimate Tic Tac Toe',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/games/LameDuck/',
		pathname = 'games/LameDuck/',
		full_description = "The Lame Duck Game! Eat smaller fish, and watch out from larger ones.",
		description = "The Lame Duck Game!",
		title = 'Lame Duck',
		name = 'Lame Duck',
	)

	category = add_category('Tools')

	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/tools/Maze/',
		pathname = 'tools/Maze',
		full_description = "Generate a Maze online!",
		description = "Generate a Maze online!",
		title = 'We Generate',
		name = 'Maze Generator',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/tools/PrimeFactorizer/',
		pathname = 'tools/PrimeFactorizer',
		full_description = "A super fast online Prime Factorizer using a sieve.",
		description = "A super fast online Prime Factorizer using a sieve.",
		title = 'We Factorize',
		name = 'Prime Factorizer',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/tools/PasswordGenerator/',
		pathname = 'tools/PasswordGenerator',
		full_description = "Generate your passwords randomly to protect your accounts!",
		description = "Generate passwords quickly.",
		title = 'We Protect',
		name = 'Password Generator',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/tools/Grapher/',
		pathname = 'tools/Grapher',
		full_description = "A function grapher with a trace and newtons' method.",
		description = "A function grapher with a trace and newtons' method.",
		title = 'We Graph',
		name = 'Grapher',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/tools/HappyNumber/',
		pathname = 'tools/HappyNumber',
		full_description = "A neat tool to calculate happy numbers, and variants.",
		description = "A neat tool to calculate happy numbers, and variants.",
		title = 'We Are Happy',
		name = 'Happy Number Calculator',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/tools/ReveresLatsLettesr/',
		pathname = 'tools/ReveresLatsLettesr',
		full_description = "Reveres Lats Tow Lettesr fo Worsd.",
		description = "Reveres Lats Tow Lettesr fo Worsd.",
		title = 'We Reverse',
		name = 'Text Reverser',
	)
	add_page(
		category = category,
		full_url = 'http://theofekfoundation.org/tools/ImageEditor/',
		pathname = 'tools/ImageEditor',
		full_description = "A neat tool to calculate happy numbers, and variants.",
		description = "A neat tool to calculate happy numbers, and variants.",
		title = 'We Are Happy',
		name = 'Image Editor',
	)

def add_category(name):
	c = WebsiteCategory.objects.get_or_create(name=name)[0]
	return c

def add_page(category, full_url, **kwargs):
	p = WebsitePage.objects.get_or_create(category=category, full_url=full_url)[0]
	for key in kwargs:
		setattr(p, key, kwargs[key])
	p.save()
	return p

def print_pages():
	for wp in WebsitePage.objects.all():
		print(wp.name)

if __name__ == '__main__':
	populate()
	print_pages()
