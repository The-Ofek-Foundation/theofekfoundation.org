# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os

from django.shortcuts import render
from django.http import HttpResponse
from django.core.mail import send_mail
from django.conf import settings

def alumni_image(request, alumnus_id):
	print(alumnus_id)
	image_url = os.path.join(settings.STATIC_PATH, "images/ramon/verified_email_thanks.png")
	print(image_url)
	image_data = open(image_url, "rb").read()
	return HttpResponse(image_data, content_type="image/png")

def send_alumni_outreach_email(self, request, alumnus):
	c = {
		'email': alumnus.email,
		'domain': request.META['HTTP_HOST'],
		'uid': urlsafe_base64_encode(force_bytes(user.pk)),
		'alumnus': alumnus,
		'protocol': 'http',
	}
	subject_template_name = 'registration/password_reset_subject.txt'
	email_template_name = 'account/password_reset_email.html'
	subject = loader.render_to_string(subject_template_name, c)
	subject = ''.join(subject.splitlines())
	email = loader.render_to_string(email_template_name, c)
	send_mail(subject, email, settings.DEFAULT_FROM_EMAIL , [user.email], fail_silently=False)
