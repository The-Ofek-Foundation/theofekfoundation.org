from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
	# This line is required. Links UserProfile to a User model instance.
	user = models.OneToOneField(User)

	# The additional attributes we wish to include.
	# website = models.URLField(blank=True)
	# picture = models.ImageField(upload_to='profile_images', blank=True)

	# Override the __unicode__() method to return out something meaningful!
	def __unicode__(self):
		return self.user.username

class WebsiteCategory(models.Model):
	name = models.CharField(max_length=128, unique=True)

	def __unicode__(self):
		return self.name

	def __str__(self):
		return self.name

class WebsitePage(models.Model):
	category = models.ForeignKey(WebsiteCategory)
	name = models.CharField(max_length=128, default='unnamed')
	full_url = models.CharField(max_length=128)
	pathname = models.CharField(max_length=128)
	full_description = models.CharField(max_length=128)
	description = models.CharField(max_length=128)
	title = models.CharField(max_length=128)
	views = models.IntegerField(default=0)

	def __unicode__(self):
		return self.name

	def __str__(self):
		return self.name

# Create your models here.
# class Category(models.Model):
# 	name = models.CharField(max_length=128, unique=True)

# 	def __unicode__(self):
# 		return self.name

# class Page(models.Model):
# 	Category = models.ForeignKey(Category)
# 	title = models.CharField(max_length=128)
# 	url = models.URLField()
# 	views = models.IntegerField(default=0)

# 	def __unicode__(self):
# 		return self.title