# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os

from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings

from ramon.models import Alumnus

def alumni_image(request, alumnus_id):
	Alumnus.objects.filter(id=alumnus_id).update(verified_email=True)
	image_url = os.path.join(settings.STATIC_PATH, "images/ramon/verified_email_thanks.png")
	image_data = open(image_url, "rb").read()
	return HttpResponse(image_data, content_type="image/png")
