# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-01-18 07:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0012_auto_20170117_2239'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamesettings',
            name='draw_style',
            field=models.CharField(max_length=128, null=True),
        ),
    ]
