# coding: utf-8

from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from main_app.forms import UserForm, UserProfileForm
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


# Create your views here.
def index(request):
	context = RequestContext(request)
	page = {
		'full_url': 'http://theofekfoundation.org',
		'pathname': '',
		'full_description': "Ofek Gila's website with many game AIs and online tools",
		'description': "Ofek Gila's main website",
		'title': 'We are Ofek',
	}
	games = {
		'header': 'Games (Most with AIs)',
		'list': [
			{
				'redirect': '/games/ConnectFour/',
				'imagesrc': '/static/images/main_app/connect-4.jpg',
				'description': 'Perhaps my strongest AI, my Connect Four Monte Carlo tree search AI is very powerful and very fast!',
			},
			{
				'redirect': '/games/OnlineGo/',
				'imagesrc': '/static/images/main_app/board-game-go.jpg',
				'description': 'Play Go, Gomoku, or Wu. The only one with an AI—however—is Gomoku—with a Minimax implementation.',
			},
			{
				'redirect': '/games/Mancala/',
				'imagesrc': '/static/images/main_app/mancala.JPG',
				'description': 'My first Monte Carlo tree search AI! The game itself is programmed with a customizable set of rules.',
			},
			{
				'redirect': '/games/UltimateTicTacToe/',
				'imagesrc': '/static/images/main_app/Ultimate-Tic-Tac-Toe.jpg',
				'description': 'An AI I literally whipped over two nights—the interface is slightly lacking—but plays well nonetheless.',
			},
			{
				'redirect': '/games/LameDuck/',
				'imagesrc': '/static/images/main_app/duck.svg',
				'description': 'This game precedes this website by half a year, and was made in a few hours. It seems to be the largest attraction of my site for some reason.',
			},
		],
	}
	tools = {
		'header': 'Tools and other Math Stuff',
		'list': [
			{
				'redirect': '/tools/Maze/',
				'imagesrc': '/static/images/main_app/maze.png',
				'description': 'A <a href="https://en.wikipedia.org/wiki/Maze_generation_algorithm#Depth-first_search">depth-first search maze generator</a> with a generation <strong>animation option</strong> and maze styles!',
			},
			{
				'redirect': '/tools/PrimeFactorizer/',
				'imagesrc': '/static/images/main_app/factor-tree.gif',
				'description': 'A super-fast prime number factorizer that uses a sieve of a size that you get to input!',
			},
			{
				'redirect': '/tools/ImageEditor/',
				'imagesrc': '/static/images/main_app/image-editor.jpg',
				'description': 'A neat little image editor that has many effects. Press \'c\' to enter commands.',
			},
			{
				'redirect': '/tools/Grapher/',
				'imagesrc': '/static/images/main_app/grapher.gif',
				'description': 'A function grapher with a neat tracing and newtons\' method (click \'n\' in trace mode).',
			},
			{
				'redirect': '/tools/HappyNumbers/',
				'imagesrc': '/static/images/main_app/happy-number.png',
				'description': 'A <a href="https://en.wikipedia.org/wiki/Happy_number">Happy Number</a> calculator.',
			},
			{
				'redirect': '/tools/ReveresLatsLettesr/',
				'imagesrc': 'https://c2.staticflickr.com/2/1270/4600275420_c7bfb8466d.jpg',
				'description': 'Reverse the last two characters of words :P',
			},
		],
	}
	projects = {
		'tools': tools,
		'games': games,
	}
	context_dict = {
		'page': page,
		'projects': projects,
	}
	return render(request, 'main_app/index.html', context_dict)


def register(request, redirect_pathname):
	# Like before, get the request's context.
	context = RequestContext(request)

	# A boolean value for telling the template whether the registration was successful.
	# Set to False initially. Code changes value to True when registration succeeds.
	registered = False

	# If it's a HTTP POST, we're interested in processing form data.
	if request.method == 'POST':
		# Attempt to grab information from the raw form information.
		# Note that we make use of both UserForm and UserProfileForm.
		user_form = UserForm(data=request.POST)
		profile_form = UserProfileForm(data=request.POST)

		# If the two forms are valid...
		if user_form.is_valid() and profile_form.is_valid():
			# Save the user's form data to the database.
			user = user_form.save()

			# Now we hash the password with the set_password method.
			# Once hashed, we can update the user object.
			user.set_password(user.password)
			user.save()

			# Now sort out the UserProfile instance.
			# Since we need to set the user attribute ourselves, we set commit=False.
			# This delays saving the model until we're ready to avoid integrity problems.
			profile = profile_form.save(commit=False)
			profile.user = user

			# Did the user provide a profile picture?
			# If so, we need to get it from the input form and put it in the UserProfile model.
			# if 'picture' in request.FILES:
			#     profile.picture = request.FILES['picture']

			# Now we save the UserProfile model instance.
			profile.save()

			# Update our variable to tell the template registration was successful.
			registered = True

			if redirect_pathname:
				return HttpResponseRedirect('/' + redirect_pathname)

		# Invalid form or forms - mistakes or something else?
		# Print problems to the terminal.
		# They'll also be shown to the user.
		else:
			print (user_form.errors, profile_form.errors)

	# Not a HTTP POST, so we render our form using two ModelForm instances.
	# These forms will be blank, ready for user input.
	else:
		user_form = UserForm()
		profile_form = UserProfileForm()

	page = {
		'full_url': 'http://theofekfoundation.org/register',
		'pathname': redirect_pathname,
		'full_description': "Register to TheOfekFoundation! Make a free account today!",
		'description': "Register to TheOfekFoundation!",
		'title': 'We Register',
	}
	context_dict = {
		'page': page,
		'user_form': user_form,
		'profile_form': profile_form,
		'registered': registered,
		'redirect_pathname': redirect_pathname,
	}
	# Render the template depending on the context.
	return render_to_response(
		'main_app/register.html', context_dict, context)

def user_login(request, redirect_pathname):
	# Like before, obtain the context for the user's request.
	context = RequestContext(request)

	# If the request is a HTTP POST, try to pull out the relevant information.
	if request.method == 'POST':
		# Gather the username and password provided by the user.
		# This information is obtained from the login form.
		username = request.POST['username']
		password = request.POST['password']

		# Use Django's machinery to attempt to see if the username/password
		# combination is valid - a User object is returned if it is.
		user = authenticate(username=username, password=password)

		# If we have a User object, the details are correct.
		# If None (Python's way of representing the absence of a value), no user
		# with matching credentials was found.
		if user:
			# Is the account active? It could have been disabled.
			if user.is_active:
				# If the account is valid and active, we can log the user in.
				# We'll send the user back to the homepage.
				login(request, user)
				return HttpResponseRedirect('/' + redirect_pathname)
			else:
				# An inactive account was used - no logging in!
				return HttpResponse("Your Rango account is disabled.")
		else:
			# Bad login details were provided. So we can't log the user in.
			print ("Invalid login details: {0}, {1}".format(username, password))
			return HttpResponse("Invalid login details supplied.")

	# The request is not a HTTP POST, so display the login form.
	# This scenario would most likely be a HTTP GET.
	else:
		# No context variables to pass to the template system, hence the
		# blank dictionary object...
		return render_to_response('main_app/login.html', {'redirect_pathname': redirect_pathname}, context)

# Use the login_required() decorator to ensure only those logged in can access the view.
@login_required
def user_logout(request, redirect_pathname):
	# Since we know the user is logged in, we can now just log them out.
	logout(request)

	# Take the user back to the homepage.
	return HttpResponseRedirect('/' + redirect_pathname)

def page_not_found(request):
	context = RequestContext(request)
	context_dict = {}
	return render(request, 'main_app/404.html', context_dict)