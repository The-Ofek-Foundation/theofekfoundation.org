from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import handler404

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'TheOfekFoundation.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^(?i)admin/', include(admin.site.urls)),
    url(r'^', include('main_app.urls')),
    url(r'^(?i)games/', include('games.urls')),
)

if settings.DEBUG:
	urlpatterns += patterns(
		'django.views.static',
		(r'^media/(?P<path>.*)',
		'serve',
		{'document_root': settings.MEDIA_ROOT}),
	)
else:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler404 = 'main_app.views.page_not_found'
