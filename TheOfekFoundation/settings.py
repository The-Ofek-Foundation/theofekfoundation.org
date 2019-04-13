"""
Django settings for TheOfekFoundation project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

TEMPLATE_PATH = os.path.join(BASE_DIR, 'templates')
STATIC_PATH = os.path.join(BASE_DIR, 'static')
MAIN_IMAGES = os.path.join(os.path.join(STATIC_PATH, 'images'), 'main_app')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

# For anyone reading this, the key used in production is different :'(
SECRET_KEY = 'i7!yq3c1yf92c_uramq!xk1x#n8@@uj9x5eta=r04_c8q@^ke^'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
	'theofekfoundation.org',
	'www.theofekfoundation.org',
	'ofekgila.com',
	'localhost',
	'ofekih.pythonanywhere.com',
	'127.0.0.1',
	'norse-limiter-155822.appspot.com',
	'google.ofekgila.com',
]

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 3600

# Application definition

INSTALLED_APPS = (
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'minidetector', # detects mobile devices (also in Middleware)
	'main_app',
	'games',
	'tools',
	'account',
	'blog',
	'ramon',
	'social_django'
)

MIDDLEWARE_CLASSES = (
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'django.middleware.security.SecurityMiddleware',
	'minidetector.Middleware'
)

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'APP_DIRS': True,
		'DIRS': [ TEMPLATE_PATH ],
		'OPTIONS': {
			'debug': DEBUG,
			'context_processors': [
				"django.contrib.auth.context_processors.auth",
				"main_app.context_processors.mobile_detection_processor",
				"social_django.context_processors.backends",
                "social_django.context_processors.login_redirect",
			]
		}
	},
]

AUTHENTICATION_BACKENDS = (
	'social_core.backends.open_id.OpenIdAuth',
	'social_core.backends.google.GoogleOpenId',
	'social_core.backends.google.GoogleOAuth2',
	'social_core.backends.github.GithubOAuth2',
	'social_core.backends.facebook.FacebookOAuth2',

	'django.contrib.auth.backends.ModelBackend',
)

STATICFILES_DIRS = (
	STATIC_PATH,
	MAIN_IMAGES
)

ROOT_URLCONF = 'TheOfekFoundation.urls'

WSGI_APPLICATION = 'TheOfekFoundation.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.sqlite3',
		'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
	}
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'PST8PDT'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

LOGIN_URL = 'Login'
LOGIN_REDIRECT_URL = 'Username'
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
	'locale': 'en_US',
	'fields': 'name, email'
}

SOCIAL_AUTH_PIPELINE = (
    # Get the information we can about the user and return it in a simple
    # format to create the user instance later. On some cases the details are
    # already part of the auth response from the provider, but sometimes this
    # could hit a provider API.
    'social_core.pipeline.social_auth.social_details',

    # Get the social uid from whichever service we're authing thru. The uid is
    # the unique identifier of the given user in the provider.
    'social_core.pipeline.social_auth.social_uid',

    # Verifies that the current auth process is valid within the current
    # project, this is where emails and domains whitelists are applied (if
    # defined).
    'social_core.pipeline.social_auth.auth_allowed',

    # Checks if the current social-account is already associated in the site.
    'social_core.pipeline.social_auth.social_user',

    # Make up a username for this person, appends a random string at the end if
    # there's any collision.
    'social_core.pipeline.user.get_username',

    # Send a validation email to the user to verify its email address.
    # Disabled by default.
    # 'social_core.pipeline.mail.mail_validation',

    # Associates the current social details with another user account with
    # a similar email address. Disabled by default.
    'social_core.pipeline.social_auth.associate_by_email',

    # Create a user account if we haven't found one yet.
    'social_core.pipeline.user.create_user',

    # Create the record that associates the social account with the user.
    'social_core.pipeline.social_auth.associate_user',

    # Populate the extra_data field in the social record with the values
    # specified by settings (and the default ones like access_token, etc).
    'social_core.pipeline.social_auth.load_extra_data',

    # Update the user record with any changed info from the auth service.
    'social_core.pipeline.user.user_details',
)

EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'The Ofek Foundation <theofekfoundation@gmail.com>'
RAMON_FROM_EMAIL = 'Seuss/Ramon AZA #195 Alumni Committee <theofekfoundation@gmail.com>'
SERVER_EMAIL = 'The Ofek Foundation <theofekfoundation@gmail.com>'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'support@theofekfoundation.org'
EMAIL_HOST_PASSWORD = "I ain't telling you"
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

DOMAIN = 'theofekfoundation.org'

if os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine'):
	try:
		from global_settings import *
	except ImportError:
		pass
else:
	# Local settings should:
	#
	# * Potentially override DATABASES for different local db
	# * Include EMAIL_HOST_PASSWORD (for protection)
	# * UPDATE THE SECRET KEY :O
	# * Set all secure HTTPS things to False (not required on local connection)
	try:
		from local_settings import *
	except ImportError:
		pass

# encoding=utf8
import sys

reload(sys)
sys.setdefaultencoding('utf8')
