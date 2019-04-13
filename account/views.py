from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from main_app.forms import UserForm, UsernameForm
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
from main_app.models import WebsiteCategory, WebsitePage, WebsiteForm
from django.http import JsonResponse
import copy

main_category = WebsiteCategory.objects.get(name='Account')
main_pages = WebsitePage.objects.filter(category=main_category)

@login_required
def set_username(request):
	if request.method == 'POST':
		username_form = UsernameForm(data=request.POST)

		if username_form.is_valid():
			setattr(request.user, 'username', username_form.data['username'])
			request.user.save()

			return HttpResponseRedirect('/')
		else:
			print(username_form.errors)

	else:
		username_form = UsernameForm()


	page = main_pages.get(name='Username')
	form = WebsiteForm.objects.get(page=page, name='username_form')

	context_dict = {
		'page': page,
		'html_form': form,
		'username_form': username_form,
		'force_form': True,
	}
	return render(request, 'account/username.html', context_dict)

def register(request):
	registered = False

	if request.method == 'POST':
		user_form = UserForm(data=request.POST)

		if user_form.is_valid():
			user = user_form.save()


			user.set_password(user.password)
			user.save()

			registered = True

			return HttpResponseRedirect('/' + request.POST['path'])
		else:
			print (user_form.errors)

	else:
		user_form = UserForm()

	page = main_pages.get(name='Register')
	form = WebsiteForm.objects.get(page=page, name='register_form')

	context_dict = {
		'page': page,
		'html_form': form,
		'user_form': user_form,
		'registered': registered,
		'force_form': False,
	}

	return render(request, 'account/register.html', context_dict)

def user_login(request):
	page = main_pages.get(name='Login')
	form = WebsiteForm.objects.get(page=page, name='login_form')

	if request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']

		user = authenticate(username=username, password=password)

		error_message = ''
		if user:
			if user.is_active:
				login(request, user)
				return HttpResponseRedirect('/' + request.POST['path'])
			else:
				error_message = "Your Rango account is disabled."
		else:
			print ("Invalid login details: {0}, {1}".format(username, password))
			error_message = "Invalid login details supplied."
		return render(request, 'account/login.html', {'page': page, 'html_form': form, 'error_message': error_message})

	else:
		return render(request, 'account/login.html', {'page': page, 'html_form': form})

@login_required
def user_logout(request):
	logout(request)

	return HttpResponseRedirect('/')

class ResetPasswordRequestView(FormView):
	template_name = 'account/reset_password.html'
	success_url = '/account/PasswordResetEmailSent/'
	form_class = PasswordResetRequestForm
	error_message = False

	def get_context_data(self, **kwargs):
		context = super(ResetPasswordRequestView, self).get_context_data(**kwargs)
		page = main_pages.get(name='Reset Password')
		form = WebsiteForm.objects.get(page=page, name='password_reset_form')

		context['page'] = page
		context['html_form'] = form
		if self.error_message:
			context['error_message'] = self.error_message
		return context

	@staticmethod
	def validate_email_address(email):
		try:
			validate_email(email)
			return True
		except ValidationError:
			return False

	def send_email_to_user(self, request, user):
		c = {
			'email': user.email,
			'domain': request.META['HTTP_HOST'],
			'site_name': 'TheOfekFoundation',
			'uid': urlsafe_base64_encode(force_bytes(user.pk)),
			'user': user,
			'token': default_token_generator.make_token(user),
			'protocol': 'http',
		}
		subject_template_name = 'registration/password_reset_subject.txt'
		email_template_name = 'account/password_reset_email.html'
		subject = loader.render_to_string(subject_template_name, c)
		subject = ''.join(subject.splitlines())
		email = loader.render_to_string(email_template_name, c)
		send_mail(subject, email, settings.DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)

	def send_emails_to_users(self, request, associated_users):
		for user in associated_users:
			self.send_email_to_user(request, user)

	def post(self, request, *args, **kwargs):
		form = self.form_class(request.POST)
		if form.is_valid():
			data = form.cleaned_data["email_or_username"]
		if self.validate_email_address(data) is True:  #uses the method written above
			'''
			If the input is an valid email address, then the following code will lookup for users associated with that email address. If found then an email will be sent to the address, else an error message will be printed on the screen.
			'''
			associated_users = User.objects.filter(Q(email=data)|Q(username=data))
			if associated_users.exists():
				self.send_emails_to_users(request, associated_users)
				result = self.form_valid(form)
				return result
			self.error_message = 'No user is associated with this email address'
			result = self.form_invalid(form)
			return result
		else:
			'''
			If the input is an username, then the following code will lookup for users associated with that user. If found then an email will be sent to the user's address, else an error message will be printed on the screen.
			'''
			associated_users = User.objects.filter(username=data)
			if associated_users.exists():
				self.send_emails_to_users(request, associated_users)
				result = self.form_valid(form)
				return result
			self.error_message = 'This username does not exist in the system.'
			result = self.form_invalid(form)
			return result
		self.error_message = 'Invalid Input'
		return self.form_invalid(form)

def password_reset_email_sent(request):
	context_dict = {'page': main_pages.get(name='Password Reset Email Sent')}
	return render(request, 'account/password_reset_email_sent.html', context_dict)

class PasswordResetConfirmView(FormView):
	template_name = "account/reset_password.html"
	success_url = '/' + main_pages.get(name='Login').pathname
	form_class = SetPasswordForm

	def get_context_data(self, **kwargs):
		context = super(PasswordResetConfirmView, self).get_context_data(**kwargs)
		page = main_pages.get(name='Reset Password Confirm')
		form = WebsiteForm.objects.get(page=page, name='password_reset_confirm_form')

		context['page'] = page
		context['html_form'] = form
		return context

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
