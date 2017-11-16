import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TheOfekFoundation.settings")
import django
django.setup()

from ramon.models import Alumnus
from django.conf import settings

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def _send_alumni_emails():
	for alumnus in Alumnus.objects.filter(email_sent=False):
		if alumnus.full_name == 'Idan Hovav':
			_send_alumnus_email(alumnus)

def _send_alumnus_email(alumnus):
	c = {
		'alumnus': alumnus,
		'protocol': 'http',
		'img_url': 'www.theofekfoundation.org/ramon/api/alumni/verify_image/' +
			str(alumnus.id),
		'google_sheet_database_url': 'https://docs.google.com/spreadsheets/d/11Df18jSmnk1UvexOyiYsrTbViel9mYAck9MPUVFN2OU/edit?usp=sharing',
	}
	email_template_name = 'ramon/alumni_outreach_email.html'
	subject = 'Seuss Alumnus Database'
	html_content = render_to_string(email_template_name, c)
	text_content = strip_tags(html_content)
	email = EmailMultiAlternatives(subject, text_content,
		settings.DEFAULT_FROM_EMAIL, [alumnus.email_address])
	email.attach_alternative(html_content, 'text/html')
	email.send()
	setattr(alumnus, 'email_sent', True)
	alumnus.save()
	print(alumnus.full_name)

if __name__ == '__main__':
	_send_alumni_emails()
