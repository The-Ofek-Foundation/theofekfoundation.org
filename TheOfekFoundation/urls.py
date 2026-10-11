from django.urls import include, path

urlpatterns = [
	path('account/', include('account.urls')),
	path('blog/', include('blog.urls')),
	path('games/', include('games.urls')),
	path('tools/', include('tools.urls')),
	path('people/', include('people.urls')),
	path('', include('main_app.urls')),
]

# Legacy shortcut URLs (e.g. /Snake/ -> /games/OldSnakey/) used to be Django
# redirects in main_app/misurls.py; on the static site they are Firebase Hosting
# redirects in firebase.json.

handler404 = 'main_app.views.page_not_found'
