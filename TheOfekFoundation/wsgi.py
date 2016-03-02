"""
WSGI config for TheOfekFoundation project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os
import sys

# path = 'home/ofekih/TheOfekFoundation'
# if path not in sys.path:
# 	sys.path.append(path)

# os.chdir(path)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TheOfekFoundation.settings")

import django
django.setup()

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
