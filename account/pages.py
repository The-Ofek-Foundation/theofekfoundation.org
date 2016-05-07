register = {
	'full_url': 'http://theofekfoundation.org',
	'pathname': 'account/register/',
	'full_description': "Register to TheOfekFoundation! Make a free account today!",
	'description': "Register to TheOfekFoundation!",
	'title': 'We Register',
	'form': {
		'id': 'user_form',
		'method': 'post',
		'action': '/account/register/',
		'enctype': 'multipart/form-data',
		'submit_value': 'Register',
		'resize': True,
	},
}

login = {
	'full_url': 'http://theofekfoundation.org',
	'pathname': 'account/login/',
	'full_description': "Login to TheOfekFoundation! Make a free account today!",
	'description': "Login to TheOfekFoundation!",
	'title': 'We Login',
	'form': {
		'id': 'login_form',
		'method': 'post',
		'action': '/account/login/',
		'submit_value': 'Login',
		'resize': True,
	},
}

reset_password = {
	'full_url': 'http://theofekfoundation.org',
	'pathname': 'account/reset_password/',
	'full_description': "Reset your password for TheOfekFoundation.",
	'description': "Reset your password.",
	'title': 'We Forget',
	'form': {
		'id': 'reset_form',
		'method': 'post',
		'action': '',
		'submit_value': 'Send Email',
		'resize': False,
	},
}