import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TheOfekFoundation.settings")
import django
django.setup()

from ramon.models import Alumnus
from django.conf import settings
from django.template import loader
from django.core.mail import send_mail

def _send_alumni_emails():
	for alumnus in Alumnus.objects.all():
		# if alumnus.email_sent == True:
		# 	continue
		if alumnus.full_name == 'Ofek Gila':
			_send_alumnus_email(alumnus)
		# print(alumnus.email_address)

def _send_alumnus_email(alumnus):
	c = {
		'alumnus': alumnus,
		'protocol': 'http',
		'img_url': 'www.theofekfoundation.org/ramon/api/alumni/verify_image/' +
			str(alumnus.id),
		'google_sheet_database_url': 'https://docs.google.com/spreadsheets/d/11Df18jSmnk1UvexOyiYsrTbViel9mYAck9MPUVFN2OU/edit?usp=sharing',
	}
	email_template_name = 'ramon/alumni_outreach_email.html'
	subject = 'Seuss Alumnus Outreach Email'
	email = loader.render_to_string(email_template_name, c)
	send_mail(subject, email, settings.DEFAULT_FROM_EMAIL , [alumnus.email_address], fail_silently=False)
	setattr(alumnus, 'email_sent', True)
	alumnus.save()

if __name__ == '__main__':
	_send_alumni_emails()
