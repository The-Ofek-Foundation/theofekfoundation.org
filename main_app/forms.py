from main_app.models import UserProfile
from django.contrib.auth.models import User
from django import forms

class UserForm(forms.ModelForm):
	password = forms.CharField(widget=forms.PasswordInput())

	class Meta:
		model = User
		fields = ('username', 'email', 'password')
		help_texts = {
			'username': '',
		}

class UserProfileForm(forms.ModelForm):
	class Meta:
		model = UserProfile
		fields = ()
		# fields = ('website', 'picture')

