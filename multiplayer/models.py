from __future__ import unicode_literals

from django.db import models
from django.db.models.fields import BooleanField
from jsonfield import JSONField

from django.contrib.auth.models import User
from games.models import GameSettings

class MultiplayerGame(models.Model):
	owner = models.ForeignKey(User)
	game_settings = models.ForeignKey(GameSettings)
	state = JSONField(default=None)
	new_data = JSONField(default=None)
