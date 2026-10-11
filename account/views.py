"""Account pages. They are static: Firebase Authentication runs in the browser
(static/assets/javascript/firebase_auth.js), so these views only render the
page shells, which build_static writes to public/account/."""

from django.shortcuts import render

from main_app.pages import get_form, get_page


def _account_page(request, page_name, template, form_name=None, **context):
	context['page'] = get_page('Account', page_name)
	if form_name:
		context['html_form'] = get_form(page_name, form_name)
	return render(request, template, context)


def register(request):
	return _account_page(request, 'Register', 'account/register.html', 'register_form', third_party_logins=True)


def login(request):
	return _account_page(request, 'Login', 'account/login.html', 'login_form', third_party_logins=True)


def logout(request):
	return _account_page(request, 'Logout', 'account/logout.html')


def username(request):
	return _account_page(request, 'Username', 'account/username.html', 'username_form', form_for='signed-in')


def reset_password(request):
	return _account_page(request, 'Reset Password', 'account/reset_password.html', 'password_reset_form')


def password_reset_email_sent(request):
	return _account_page(request, 'Password Reset Email Sent', 'account/password_reset_email_sent.html')
