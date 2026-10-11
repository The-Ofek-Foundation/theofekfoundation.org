from django.http import HttpResponse


def placeholder(request):
	"""Temporary stand-in until the Firebase Authentication pages exist (migration Phase 3c)."""
	return HttpResponse('Accounts are moving to Firebase. Coming soon!', content_type='text/plain')
