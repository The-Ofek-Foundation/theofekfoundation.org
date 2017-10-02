from django.shortcuts import HttpResponseRedirect
from django.conf import settings

def blog(request, pathname):
	return HttpResponseRedirect("https://blog." + settings.DOMAIN + "/" + pathname)
