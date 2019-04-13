# -*- coding: utf-8 -*-

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TheOfekFoundation.settings")
import django
django.setup()

from main_app.models import WebsiteCategory, WebsitePage, WebsiteForm

def populate():
	category = add_category('Homepage')

	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org',
		pathname = '',
		full_description = "Ofek Gila's website with many game AIs and online tools",
		description = "Ofek Gila's main website",
		title = 'We are Ofek',
		name = 'Homepage',
	)

	category = add_category('People')

	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/people/Edan',
		pathname = 'Edan/',
		full_description = "Cause darn you",
		description = "Dau bu Doe Badau",
		title = 'The Fitnessgram Pacer Test is a Multistage Aerobic Capacity Test...',
		name = 'EBM',
	)

	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/people/Ron',
		pathname = 'Ron/',
		full_description = "Awesome kid!",
		description = "Awesome kid!",
		title = 'We are Ron',
		name = 'Ron Kibel',
	)

	category = add_category('Blog')

	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/blog/',
		pathname = 'blog/',
		full_description = "TheOfekFoundation's Official Blog!",
		description = "TheOfekFoundation's Official Blog!",
		title = 'We Blog',
		name = 'Blog',
	)

	category = add_category('Games')

	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/',
		pathname = 'games/',
		full_description = "Play games on TheOfekFoundation! Either two player, or against the (very powerful) AIs!",
		description = "Play games on TheOfekFoundation!",
		title = 'We Play',
		name = 'Games Home',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/ConnectFour/',
		pathname = 'games/ConnectFour/',
		full_description = "Connect Four online Monte Carlo AI! Play against human or strong computer! Save your games easily!",
		description = "Connect Four online Monte Carlo AI!",
		title = 'Connect Ofek',
		name = 'Connect Four',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/OnlineGo/',
		pathname = 'games/OnlineGo/',
		full_description = "The online games of Go (Weiqi), Gomoku (with a minimax AI), and Wu, with a strong minimax AI for Gomoku.",
		description = "Play games in the Go family online!",
		title = 'We iqi',
		name = 'Weiqi',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/Mancala/',
		pathname = 'games/Mancala/',
		full_description = "Mancala online with a strong Monte Carlo AI computer!",
		description = "Mancala online with a strong Monte Carlo AI computer!",
		title = 'Mancala Kalah',
		name = 'Mancala',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/UltimateTicTacToe/',
		pathname = 'games/UltimateTicTacToe/',
		full_description = "Play Ultimate Tic Tac Toe online against the computer with a Monte Carlo tree search AI! This is currently the strongest Ultimate Tic Tac Toe bot, AI, computer, out there, by far!",
		description = "Ultimate Tic Tac Toe online with a strong Monte Carlo AI computer!",
		title = 'Ultimate Tic Tac Toe',
		name = 'Ultimate Tic Tac Toe',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/LameDuck/',
		pathname = 'games/LameDuck/',
		full_description = "The Lame Duck Game! Eat smaller fish, and watch out from larger ones.",
		description = "The Lame Duck Game!",
		title = 'Lame Duck',
		name = 'Lame Duck',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/OldSnakey/',
		pathname = 'games/OldSnakey/',
		full_description = "The Old Snakey retro game with multiplayer functionality, including against AI opponents!",
		description = "The Old Snakey retro game!",
		title = 'We Snakey',
		name = 'Old Snakey',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/Minesweeper/',
		pathname = 'games/Minesweeper/',
		full_description = "Play Minesweeper online with varying difficulty levels!",
		description = "Play Minesweeper online!",
		title = 'We Sweep',
		name = 'Minesweeper',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/DotsAndBoxes/',
		pathname = 'games/DotsAndBoxes/',
		full_description = "Play Dots and Boxes online!",
		description = "Play Dots and Boxes online!",
		title = 'We Dot & We Box',
		name = 'Dots and Boxes',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/Crossroads/',
		pathname = 'games/Crossroads/',
		full_description= "Play the Israeli מפגשים צולבים game online against an AI!",
		description = "Play the Israeli מפגשים צולבים game online!",
		title = 'מפגשים צולבים',
		name = 'מפגשים צולבים',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/games/Othello/',
		pathname = 'games/Othello/',
		full_description= "Play Othello (Reversi) online against an AI!",
		description = "Play Othello online!",
		title = 'We Flip',
		name = 'Othello',
	)

	category = add_category('Tools')

	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/',
		pathname = 'tools/',
		full_description = "Use tools on TheOfekFoundation! Some have cool settings and fun stuff.",
		description = "Use tools on TheOfekFoundation!",
		title = 'We Do',
		name = 'Tools Home',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/Maze/',
		pathname = 'tools/Maze',
		full_description = "Generate a Maze online!",
		description = "Generate a Maze online!",
		title = 'We Generate',
		name = 'Maze Generator',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/PrimeFactorizer/',
		pathname = 'tools/PrimeFactorizer',
		full_description = "A super fast online Prime Factorizer using a sieve.",
		description = "A super fast online Prime Factorizer using a sieve.",
		title = 'We Factorize',
		name = 'Prime Factorizer',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/PasswordGenerator/',
		pathname = 'tools/PasswordGenerator',
		full_description = "Generate your passwords randomly to protect your accounts!",
		description = "Generate passwords quickly.",
		title = 'We Protect',
		name = 'Password Generator',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/Grapher/',
		pathname = 'tools/Grapher',
		full_description = "A function grapher with a trace and newtons' method.",
		description = "A function grapher with a trace and newtons' method.",
		title = 'We Graph',
		name = 'Grapher',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/HappyNumber/',
		pathname = 'tools/HappyNumber',
		full_description = "A neat tool to calculate happy numbers, and variants.",
		description = "A neat tool to calculate happy numbers, and variants.",
		title = 'We Are Happy',
		name = 'Happy Number Calculator',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/ReveresLatsLettesr/',
		pathname = 'tools/ReveresLatsLettesr',
		full_description = "Reveres Lats Tow Lettesr fo Worsd.",
		description = "Reveres Lats Tow Lettesr fo Worsd.",
		title = 'We Reverse',
		name = 'Text Reverser',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/ImageEditor/',
		pathname = 'tools/ImageEditor',
		full_description = "A neat tool to calculate happy numbers, and variants.",
		description = "A neat tool to calculate happy numbers, and variants.",
		title = 'We Are Happy',
		name = 'Image Editor',
	)
	add_page(
		category = category,
		full_url = 'https://www.theofekfoundation.org/tools/DijkstraAlgorithm/',
		pathname = 'tools/DijkstraAlgorithm',
		full_description = "An implementation of Dijkstra's shortest path algorithm.",
		description = "An implementation of Dijkstra's shortest path algorithm.",
		title = 'We Find Paths',
		name = 'Dijkstra Algorithm',
	)

	category = add_category('Account')

	page = add_page(category, 'https://www.theofekfoundation.org/account/register/',
		pathname = 'account/register',
		full_description = "Register to The Ofek Foundation! Make a free account today!",
		description = "Register to The Ofek Foundation!",
		title = 'We Register',
		name = 'Register',
	)
	add_form(page, 'register_form',
		method = 'post',
		action = '/account/register/',
		enctype = 'multipart/form-data',
		submit_value = 'Register',
		resizeable = True,
	)

	page = add_page(category, 'https://www.theofekfoundation.org/account/username/',
		pathname = 'account/username',
		full_description = "Update your username for The Ofek Foundation!",
		description = "Update your username for The Ofek Foundation!",
		title = 'We are Reborn',
		name = 'Username',
	)
	add_form(page, 'username_form',
		method = 'post',
		action = '/account/username/',
		enctype = 'multipart/form-data',
		submit_value = 'Rebirth',
		resizeable = True,
	)

	page = add_page(category, 'https://www.theofekfoundation.org/account/login/',
		pathname = 'account/login',
		full_description = "Login to The Ofek Foundation! Make a free account today!",
		description = "Login to The Ofek Foundation!",
		title = 'We Login',
		name = 'Login',
	)
	add_form(page, 'login_form',
		method = 'post',
		action = '/account/login/',
		submit_value = 'Login',
		resizeable = True,
	)

	page = add_page(category, 'https://www.theofekfoundation.org/account/ResetPassword/',
		pathname = 'account/ResetPassword',
		full_description = "Reset your password for The Ofek Foundation.",
		description = "Reset your password.",
		title = 'We Forget',
		name = 'Reset Password',
	)
	add_form(page, 'password_reset_form',
		method = 'post',
		action = '',
		submit_value = 'Send Email',
		resizeable = False,
	)

	page = add_page(category, 'https://www.theofekfoundation.org/account/ResetPasswordConfirm/',
		pathname = 'account/ResetPasswordConfirm',
		full_description = "Reset your password for The Ofek Foundation.",
		description = "Reset your password.",
		title = 'We Promise to Remember',
		name = 'Reset Password Confirm',
	)
	add_form(page, 'password_reset_confirm_form',
		method = 'post',
		action = '',
		submit_value = 'Reset Password',
		resizeable = False,
	)

	add_page(category, 'https://www.theofekfoundation.org/account/PasswordResetEmailSent/',
		pathname = 'account/PasswordResetEmailSent',
		full_description = "Password reset email was sent.",
		description = "Reset your password.",
		title = 'We Forgot',
		name = 'Password Reset Email Sent',
	)

def clear_all_table(table):
	table.objects.all().delete()

def clear_all_website_elems():
	clear_all_table(WebsiteCategory)
	clear_all_table(WebsitePage)
	clear_all_table(WebsiteForm)

def add_category(name):
	category = WebsiteCategory.objects.get_or_create(name=name)[0]
	return category

def update_object(obj, **kwargs):
	for key in kwargs:
		setattr(obj, key, kwargs[key])
	obj.save()
	return obj

def add_page(category, full_url, **kwargs):
	page = WebsitePage.objects.get_or_create(category=category, full_url=full_url)[0]
	return update_object(page, **kwargs)

def add_form(page, name, **kwargs):
	form = WebsiteForm.objects.get_or_create(page=page, name=name)[0]
	return update_object(form, **kwargs)

def print_pages():
	for wp in WebsitePage.objects.all():
		print(wp.name)

if __name__ == '__main__':
	# clear_all_table(WebsitePage)
	# clear_all_table(WebsiteForm)
	populate()
	print_pages()
