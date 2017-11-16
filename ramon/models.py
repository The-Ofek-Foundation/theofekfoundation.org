# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models.fields import CharField, IntegerField, NullBooleanField

class Alumnus(models.Model):
	full_name = CharField(max_length=128)
	first_name = CharField(max_length=128)
	last_name = CharField(max_length=128)
	grad_year = IntegerField(null=True)
	email_address = CharField(max_length=128)
	facebook_url = CharField(max_length=128, null=True)
	linkedin_url = CharField(max_length=128, null=True)
	curr_location = CharField(max_length=128, null=True)
	email_sent = NullBooleanField(default=False)
	verified_email = NullBooleanField(default=False)
