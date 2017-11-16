from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import handler404
from django.db.utils import OperationalError

from django.contrib import admin
admin.autodiscover()

try:
	urlpatterns = [
		# Examples:
		# url(r'^$', 'TheOfekFoundation.views.home', name='home'),

		url(r'^account/', include('account.urls')),
		url(r'^admin/', include(admin.site.urls)),
		url(r'^blog/', include('blog.urls')),
		url(r'^games/', include('games.urls')),
		url(r'^tools/', include('tools.urls')),
		url(r'^people/', include('people.urls')),
		url(r'^ramon/', include('ramon.urls')),
		url(r'^', include('main_app.urls')),
	]
except OperationalError:
	urlpatterns = []
	print "Run migrations and populate pages!!!\n"

# if settings.DEBUG:
# 	urlpatterns += patterns(
# 		'django.views.static',
# 		(r'^media/(?P<path>.*)',
# 		'serve',
# 		{'document_root': settings.MEDIA_ROOT}),
# 	)
# else:
# 	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler404 = 'main_app.views.page_not_found'
