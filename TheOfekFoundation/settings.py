"""
Django settings for TheOfekFoundation project.

The site is rendered to static files by ``python manage.py build_static`` and
served from Firebase Hosting, so Django only renders templates and collects
static files. There is no database: user accounts and saved game settings live
in Firebase (Authentication + Firestore), handled in the browser.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.2/ref/settings/
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

TEMPLATE_PATH = BASE_DIR / 'templates'
STATIC_PATH = BASE_DIR / 'static'
MAIN_IMAGES = STATIC_PATH / 'images' / 'main_app'

# Only used while rendering the static build; nothing secret is signed with it.
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'static-build-only-not-a-secret')

# Set DJANGO_DEBUG=1 for `manage.py runserver` during development.
DEBUG = os.environ.get('DJANGO_DEBUG') == '1'

ALLOWED_HOSTS = ['testserver', 'localhost', '127.0.0.1']

# Application definition

INSTALLED_APPS = [
	'django.contrib.staticfiles',
	'main_app',
	'games',
	'tools',
	'people',
	'account',
]

MIDDLEWARE = [
	'django.middleware.common.CommonMiddleware',
]

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [TEMPLATE_PATH],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.request',
			],
			'libraries': {
				# Django 3.0 removed {% load staticfiles %}; the people/* templates
				# (separate git submodules) still use it, so alias it to `static`.
				'staticfiles': 'django.templatetags.static',
			},
		},
	},
]

ROOT_URLCONF = 'TheOfekFoundation.urls'

WSGI_APPLICATION = 'TheOfekFoundation.wsgi.application'

# No database (see module docstring).
DATABASES = {}

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'America/Los_Angeles'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = (
	STATIC_PATH,
	MAIN_IMAGES,
)

# collectstatic copies everything here as part of the static build.
STATIC_ROOT = BASE_DIR / 'public' / 'static'

DOMAIN = 'theofekfoundation.org'
