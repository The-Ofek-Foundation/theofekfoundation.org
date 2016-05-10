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


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'i7!yq3c1yf92c_uramq!xk1x#n8@@uj9x5eta=r04_c8q@^ke^'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['theofekfoundation.org', 'localhost', 'ofekih.pythonanywhere.com']


# Application definition

INSTALLED_APPS = (
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'main_app',
	'games',
	'tools',
	'account',
	'blog',
)

MIDDLEWARE_CLASSES = (
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_DIRS = (
    TEMPLATE_PATH,
)

STATICFILES_DIRS = (
	STATIC_PATH,
)

ROOT_URLCONF = 'TheOfekFoundation.urls'

WSGI_APPLICATION = 'TheOfekFoundation.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

# DATABASES = {
# 	'default': {
# 		'ENGINE': 'django.db.backends.sqlite3',
# 		'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
# 	}
# }

# Uncomment below lines for distribution
DATABASES = {
	 'default': {
		 'ENGINE': 'django.db.backends.mysql',
		 'NAME': 'ofekih$theofekfoundationdb',
		 'USER': 'ofekih',
		 'PASSWORD': 'awesome1',
		 'HOST': 'ofekih.mysql.pythonanywhere-services.com',
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

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

LOGIN_URL = '/account/login/'

EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'theofekfoundation@gmail.com'
SERVER_EMAIL = 'theofekfoundation@gmail.com'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'theofekfoundation@gmail.com'
EMAIL_HOST_PASSWORD = 'SFEuy5476yRHdfhyey#^%$7845:{'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'