from main_app.models import UserProfile
from django.contrib.auth.models import User
from django import forms

class UserForm(forms.ModelForm):
	password = forms.CharField(widget=forms.PasswordInput())

	class Meta:
		model = User
		fields = ('username', 'first_name', 'last_name', 'email', 'password')
		help_texts = {
			'username': '',
		}

class UsernameForm(forms.ModelForm):

	class Meta:
		model = User
		fields = ('username',)
		help_texts = {
			'username': '',
		}
