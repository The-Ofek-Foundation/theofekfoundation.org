# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-08-06 07:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0002_auto_20160805_0013'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamesettings',
            name='tie',
            field=models.NullBooleanField(),
        ),
    ]