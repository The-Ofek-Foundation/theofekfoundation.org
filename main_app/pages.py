"""Metadata for every page on the site.

This data used to live in the ``WebsiteCategory``/``WebsitePage``/``WebsiteForm``
database tables (filled in by the old ``populate_pages.py``). It was copied from
the production MySQL database on 2026-10-11, when the site became a static build
with no database.
"""

from dataclasses import dataclass

SITE_URL = 'https://www.theofekfoundation.org'


@dataclass(frozen=True)
class Page:
	"""Title and description metadata rendered into each page's <head>."""

	category: str
	name: str
	full_url: str
	pathname: str
	full_description: str
	description: str
	title: str


@dataclass(frozen=True)
class Form:
	"""Presentation settings for the account forms (used by account templates)."""

	page: str
	name: str
	method: str
	action: str
	enctype: str
	submit_value: str
	resizeable: bool


PAGES = (
	Page('Homepage', 'Homepage', f'{SITE_URL}', '',
		"Ofek Gila's website with many game AIs and online tools",
		"Ofek Gila's main website",
		'We are Ofek'),

	Page('People', 'EBM', f'{SITE_URL}/people/Edan', 'Edan/',
		'Cause darn you',
		'Dau bu Doe Badau',
		'The Fitnessgram Pacer Test is a Multistage Aerobic Capacity Test...'),
	Page('People', 'Ron Kibel', f'{SITE_URL}/people/Ron', 'Ron/',
		'Awesome kid!',
		'Awesome kid!',
		'We are Ron'),

	Page('Blog', 'Blog', f'{SITE_URL}/blog/', 'blog/',
		"TheOfekFoundation's Official Blog!",
		"TheOfekFoundation's Official Blog!",
		'We Blog'),

	Page('Games', 'Games Home', f'{SITE_URL}/games/', 'games/',
		'Play games on TheOfekFoundation! Either two player, or against the (very powerful) AIs!',
		'Play games on TheOfekFoundation!',
		'We Play'),
	Page('Games', 'Connect Four', f'{SITE_URL}/games/ConnectFour/', 'games/ConnectFour/',
		'Connect Four online Monte Carlo AI! Play against human or strong computer! Save your games easily!',
		'Connect Four online Monte Carlo AI!',
		'Connect Ofek'),
	Page('Games', 'Weiqi', f'{SITE_URL}/games/OnlineGo/', 'games/OnlineGo/',
		'The online games of Go (Weiqi), Gomoku (with a minimax AI), and Wu, with a strong minimax AI for Gomoku.',
		'Play games in the Go family online!',
		'We iqi'),
	Page('Games', 'Mancala', f'{SITE_URL}/games/Mancala/', 'games/Mancala/',
		'Mancala online with a strong Monte Carlo AI computer!',
		'Mancala online with a strong Monte Carlo AI computer!',
		'Mancala Kalah'),
	Page('Games', 'Ultimate Tic Tac Toe', f'{SITE_URL}/games/UltimateTicTacToe/', 'games/UltimateTicTacToe/',
		'Play Ultimate Tic Tac Toe online against the computer with a Monte Carlo tree search AI! This is currently the strongest Ultimate Tic Tac Toe bot, AI, computer, out there, by far!',
		'Ultimate Tic Tac Toe online with a strong Monte Carlo AI computer!',
		'Ultimate Tic Tac Toe'),
	Page('Games', 'Lame Duck', f'{SITE_URL}/games/LameDuck/', 'games/LameDuck/',
		'The Lame Duck Game! Eat smaller fish, and watch out from larger ones.',
		'The Lame Duck Game!',
		'Lame Duck'),
	Page('Games', 'Old Snakey', f'{SITE_URL}/games/OldSnakey/', 'games/OldSnakey/',
		'The Old Snakey retro game with multiplayer functionality, including against AI opponents!',
		'The Old Snakey retro game!',
		'We Snakey'),
	Page('Games', 'Minesweeper', f'{SITE_URL}/games/Minesweeper/', 'games/Minesweeper/',
		'Play Minesweeper online with varying difficulty levels!',
		'Play Minesweeper online!',
		'We Sweep'),
	Page('Games', 'Dots and Boxes', f'{SITE_URL}/games/DotsAndBoxes/', 'games/DotsAndBoxes/',
		'Play Dots and Boxes online!',
		'Play Dots and Boxes online!',
		'We Dot & We Box'),
	Page('Games', 'מפגשים צולבים', f'{SITE_URL}/games/Crossroads/', 'games/Crossroads/',
		'Play the Israeli מפגשים צולבים game online against an AI!',
		'Play the Israeli מפגשים צולבים game online!',
		'מפגשים צולבים'),
	Page('Games', 'Othello', f'{SITE_URL}/games/Othello/', 'games/Othello/',
		'Play Othello (Reversi) online against an AI!',
		'Play Othello online!',
		'We Flip'),
	Page('Games', 'Hangman', f'{SITE_URL}/games/Hangman/', 'games/Hangman/',
		'Play Hangman online!',
		'Play Hangman online!',
		'We Hang'),

	Page('Tools', 'Tools Home', f'{SITE_URL}/tools/', 'tools/',
		'Use tools on TheOfekFoundation! Some have cool settings and fun stuff.',
		'Use tools on TheOfekFoundation!',
		'We Do'),
	Page('Tools', 'Maze Generator', f'{SITE_URL}/tools/Maze/', 'tools/Maze',
		'Generate a Maze online!',
		'Generate a Maze online!',
		'We Generate'),
	Page('Tools', 'Prime Factorizer', f'{SITE_URL}/tools/PrimeFactorizer/', 'tools/PrimeFactorizer',
		'A super fast online Prime Factorizer using a sieve.',
		'A super fast online Prime Factorizer using a sieve.',
		'We Factorize'),
	Page('Tools', 'Password Generator', f'{SITE_URL}/tools/PasswordGenerator/', 'tools/PasswordGenerator',
		'Generate your passwords randomly to protect your accounts!',
		'Generate passwords quickly.',
		'We Protect'),
	Page('Tools', 'Grapher', f'{SITE_URL}/tools/Grapher/', 'tools/Grapher',
		"A function grapher with a trace and newtons' method.",
		"A function grapher with a trace and newtons' method.",
		'We Graph'),
	# The database had /tools/HappyNumber/ (singular), which never matched the
	# real route (/tools/HappyNumbers/), so the canonical link pointed at a 404.
	Page('Tools', 'Happy Number Calculator', f'{SITE_URL}/tools/HappyNumbers/', 'tools/HappyNumbers',
		'A neat tool to calculate happy numbers, and variants.',
		'A neat tool to calculate happy numbers, and variants.',
		'We Are Happy'),
	Page('Tools', 'Text Reverser', f'{SITE_URL}/tools/ReveresLatsLettesr/', 'tools/ReveresLatsLettesr',
		'Reveres Lats Tow Lettesr fo Worsd.',
		'Reveres Lats Tow Lettesr fo Worsd.',
		'We Reverse'),
	Page('Tools', 'Image Editor', f'{SITE_URL}/tools/ImageEditor/', 'tools/ImageEditor',
		'A neat tool to calculate happy numbers, and variants.',
		'A neat tool to calculate happy numbers, and variants.',
		'We Are Happy'),
	Page('Tools', 'Dijkstra Algorithm', f'{SITE_URL}/tools/DijkstraAlgorithm/', 'tools/DijkstraAlgorithm',
		"An implementation of Dijkstra's shortest path algorithm.",
		"An implementation of Dijkstra's shortest path algorithm.",
		'We Find Paths'),

	Page('Account', 'Register', f'{SITE_URL}/account/register/', 'account/register',
		'Register to The Ofek Foundation! Make a free account today!',
		'Register to The Ofek Foundation!',
		'We Register'),
	Page('Account', 'Login', f'{SITE_URL}/account/login/', 'account/login',
		'Login to The Ofek Foundation! Make a free account today!',
		'Login to The Ofek Foundation!',
		'We Login'),
	Page('Account', 'Reset Password', f'{SITE_URL}/account/ResetPassword/', 'account/ResetPassword',
		'Reset your password for The Ofek Foundation.',
		'Reset your password.',
		'We Forget'),
	Page('Account', 'Reset Password Confirm', f'{SITE_URL}/account/ResetPasswordConfirm/', 'account/ResetPasswordConfirm',
		'Reset your password for The Ofek Foundation.',
		'Reset your password.',
		'We Promise to Remember'),
	Page('Account', 'Password Reset Email Sent', f'{SITE_URL}/account/PasswordResetEmailSent/', 'account/PasswordResetEmailSent',
		'Password reset email was sent.',
		'Reset your password.',
		'We Forgot'),
	Page('Account', 'Username', f'{SITE_URL}/account/username/', 'account/username',
		'Update your username for The Ofek Foundation!',
		'Update your username for The Ofek Foundation!',
		'We are Reborn'),
)

FORMS = (
	Form('Register', 'register_form', 'post', '/account/register/', 'multipart/form-data', 'Register', True),
	Form('Login', 'login_form', 'post', '/account/login/', 'application/x-www-form-urlencoded', 'Login', True),
	Form('Reset Password', 'password_reset_form', 'post', '', 'application/x-www-form-urlencoded', 'Send Email', False),
	Form('Reset Password Confirm', 'password_reset_confirm_form', 'post', '', 'application/x-www-form-urlencoded', 'Reset Password', False),
	Form('Username', 'username_form', 'post', '/account/username/', 'multipart/form-data', 'Rebirth', True),
)

_PAGES_BY_KEY = {(page.category, page.name): page for page in PAGES}
_FORMS_BY_KEY = {(form.page, form.name): form for form in FORMS}


def get_page(category, name):
	"""Returns the Page with the given category and name (raises KeyError if missing)."""
	return _PAGES_BY_KEY[(category, name)]


def get_form(page_name, form_name):
	"""Returns the Form for the given account page and form name."""
	return _FORMS_BY_KEY[(page_name, form_name)]
