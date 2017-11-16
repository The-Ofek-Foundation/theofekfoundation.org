import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TheOfekFoundation.settings")
import django
django.setup()

from ramon.models import Alumnus
from ramon.alumnus_database import alumni

def _add_alumni():
	for alumnus in alumni:
		if alumnus['email_address']:
			alumnus['full_name'] = alumnus['first_name'] + ' ' + alumnus['last_name']
			_add_alumnus(**alumnus)

def _update_object(obj, **kwargs):
	for key in kwargs:
		setattr(obj, key, kwargs[key])
	obj.save()
	return obj

def _add_alumnus(**kwargs):
	alumnus = Alumnus.objects.get_or_create(email_address=kwargs['email_address'])[0]
	return _update_object(alumnus, **kwargs)

if __name__ == '__main__':
	_add_alumni()
