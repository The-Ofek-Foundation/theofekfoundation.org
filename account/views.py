from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from main_app.forms import UserForm, UserProfileForm
from django.template import RequestContext, loader
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.views.generic import *
from account.forms import PasswordResetRequestForm, SetPasswordForm
from django.contrib import messages
from django.contrib.auth.models import User
from django.db.models.query_utils import Q
from django.conf import settings
from account import pages

# Create your views here.
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
			#	 profile.picture = request.FILES['picture']

			# Now we save the UserProfile model instance.
			profile.save()

			# Update our variable to tell the template registration was successful.
			registered = True

			return HttpResponseRedirect('/' + pages.login['pathname'] + redirect_pathname)

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

	page = pages.register
	page['pathname'] = redirect_pathname
	page['form']['action'] += redirect_pathname

	context_dict = {
		'page': page,
		'user_form': user_form,
		'profile_form': profile_form,
		'registered': registered,
		'redirect_pathname': redirect_pathname,
	}
	# Render the template depending on the context.
	return render_to_response(
		'account/register.html', context_dict, context)

def user_login(request, redirect_pathname):
	# Like before, obtain the context for the user's request.
	context = RequestContext(request)

	page = pages.login
	page['pathname'] = redirect_pathname
	page['form']['action'] += redirect_pathname

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
		error_message = ''
		if user:
			# Is the account active? It could have been disabled.
			if user.is_active:
				# If the account is valid and active, we can log the user in.
				# We'll send the user back to the homepage.
				login(request, user)
				return HttpResponseRedirect('/' + redirect_pathname)
			else:
				# An inactive account was used - no logging in!
				error_message = "Your Rango account is disabled."
		else:
			# Bad login details were provided. So we can't log the user in.
			print ("Invalid login details: {0}, {1}".format(username, password))
			error_message = "Invalid login details supplied."
		return render_to_response('account/login.html', {'page': page, 'redirect_pathname': redirect_pathname, 'error_message': error_message}, context)

	# The request is not a HTTP POST, so display the login form.
	# This scenario would most likely be a HTTP GET.
	else:
		# No context variables to pass to the template system, hence the
		# blank dictionary object...
		return render_to_response('account/login.html', {'page': page, 'redirect_pathname': redirect_pathname}, context)

# Use the login_required() decorator to ensure only those logged in can access the view.
@login_required
def user_logout(request, redirect_pathname):
	# Since we know the user is logged in, we can now just log them out.
	logout(request)

	# Take the user back to the homepage.
	return HttpResponseRedirect('/' + redirect_pathname)

class ResetPasswordRequestView(FormView):
	template_name = "account/reset_password.html"
	success_url = '/account/reset_password/'
	form_class = PasswordResetRequestForm

	def get_context_data(self, **kwargs):
		context = super(ResetPasswordRequestView, self).get_context_data(**kwargs)
		context['page'] = pages.reset_password
		return context

	@staticmethod
	def validate_email_address(email):
		try:
			validate_email(email)
			return True
		except ValidationError:
			return False

	def post(self, request, *args, **kwargs):
		form = self.form_class(request.POST)
		if form.is_valid():
			data = form.cleaned_data["email_or_username"]
		if self.validate_email_address(data) is True:				 #uses the method written above
			'''
			If the input is an valid email address, then the following code will lookup for users associated with that email address. If found then an email will be sent to the address, else an error message will be printed on the screen.
			'''
			associated_users= User.objects.filter(Q(email=data)|Q(username=data))
			if associated_users.exists():
				for user in associated_users:
						c = {
							'email': user.email,
							'domain': request.META['HTTP_HOST'],
							'site_name': 'TheOfekFoundation',
							'uid': urlsafe_base64_encode(force_bytes(user.pk)),
							'user': user,
							'token': default_token_generator.make_token(user),
							'protocol': 'http',
							}
						subject_template_name='registration/password_reset_subject.txt'
						# copied from django/contrib/admin/templates/registration/password_reset_subject.txt to templates directory
						email_template_name='registration/password_reset_email.html'
						# copied from django/contrib/admin/templates/registration/password_reset_email.html to templates directory
						subject = loader.render_to_string(subject_template_name, c)
						# Email subject *must not* contain newlines
						subject = ''.join(subject.splitlines())
						email = loader.render_to_string(email_template_name, c)
						send_mail(subject, email, settings.DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
				result = self.form_valid(form)
				messages.success(request, 'An email has been sent to ' + data +". Please check its inbox to continue reseting password.")
				return result
			result = self.form_invalid(form)
			messages.error(request, 'No user is associated with this email address')
			return result
		else:
			'''
			If the input is an username, then the following code will lookup for users associated with that user. If found then an email will be sent to the user's address, else an error message will be printed on the screen.
			'''
			associated_users= User.objects.filter(username=data)
			if associated_users.exists():
				for user in associated_users:
					c = {
						'email': user.email,
						'domain': 'theofekfoundation.org', #or your domain
						'site_name': 'TheOfekFoundation',
						'uid': urlsafe_base64_encode(force_bytes(user.pk)),
						'user': user,
						'token': default_token_generator.make_token(user),
						'protocol': 'http',
						}
					subject_template_name='registration/password_reset_subject.txt'
					email_template_name='registration/password_reset_email.html'
					subject = loader.render_to_string(subject_template_name, c)
					# Email subject *must not* contain newlines
					subject = ''.join(subject.splitlines())
					email = loader.render_to_string(email_template_name, c)
					send_mail(subject, email, settings.DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
				result = self.form_valid(form)
				messages.success(request, 'Email has been sent to ' + data +"'s email address. Please check its inbox to continue reseting password.")
				return result
			result = self.form_invalid(form)
			messages.error(request, 'This username does not exist in the system.')
			return result
		messages.error(request, 'Invalid Input')
		return self.form_invalid(form)

class PasswordResetConfirmView(FormView):
	template_name = "account/test_template.html"
	success_url = '/' + pages.login['pathname']
	form_class = SetPasswordForm

	def post(self, request, uidb64=None, token=None, *arg, **kwargs):
		"""
		View that checks the hash in a password reset link and presents a
		form for entering a new password.
		"""
		UserModel = get_user_model()
		form = self.form_class(request.POST)
		assert uidb64 is not None and token is not None  # checked by URLconf
		try:
			uid = urlsafe_base64_decode(uidb64)
			user = UserModel._default_manager.get(pk=uid)
		except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
			user = None

		if user is not None and default_token_generator.check_token(user, token):
			if form.is_valid():
				new_password= form.cleaned_data['new_password2']
				user.set_password(new_password)
				user.save()
				messages.success(request, 'Password has been reset.')
				return self.form_valid(form)
			else:
				messages.error(request, 'Password reset has not been unsuccessful.')
				return self.form_invalid(form)
		else:
			messages.error(request,'The reset password link is no longer valid.')
			return self.form_invalid(form)