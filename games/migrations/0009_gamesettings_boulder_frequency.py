# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-24 06:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0008_auto_20161123_0009'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamesettings',
            name='boulder_frequency',
            field=models.IntegerField(null=True),
        ),
    ]
