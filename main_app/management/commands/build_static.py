"""Renders the whole site to static files in public/ for Firebase Hosting.

Usage:  .venv/bin/python manage.py build_static

Every page in main_app.pages.PAGES (except categories served elsewhere) is
requested through Django's test client and written to public/ using the same
URL layout as the old Django site, e.g. /games/Mancala/ -> public/games/Mancala/index.html
and /people/Edan -> public/people/Edan.html (Firebase Hosting "cleanUrls"
serves it at /people/Edan). Static files are collected into public/static/.
"""

import shutil
from pathlib import Path

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.test import Client

from main_app.pages import PAGES, SITE_URL

# Categories that are not rendered as pages: the blog lives on its own
# subdomain (/blog/** is a Firebase redirect).
SKIPPED_CATEGORIES = {'Blog'}

# URLs that are not in PAGES.
EXTRA_URLS = ['/privacy', '/robots.txt', '/sitemap.xml']


def page_urls():
	urls = [page.full_url[len(SITE_URL):] or '/' for page in PAGES if page.category not in SKIPPED_CATEGORIES]
	return urls + EXTRA_URLS


def output_path(public_dir, url):
	"""Maps a URL path to the file Firebase Hosting serves for it."""
	relative = url.lstrip('/')
	if not relative or url.endswith('/'):
		return public_dir / relative / 'index.html'
	if Path(relative).suffix:  # robots.txt, sitemap.xml
		return public_dir / relative
	return public_dir / f'{relative}.html'


class Command(BaseCommand):
	help = 'Builds the static site into public/ (for Firebase Hosting).'

	def handle(self, *args, **options):
		public_dir = Path(settings.BASE_DIR) / 'public'
		if public_dir.exists():
			shutil.rmtree(public_dir)

		call_command('collectstatic', interactive=False, verbosity=0)

		client = Client()
		urls = page_urls()
		for url in urls:
			response = client.get(url)
			if response.status_code != 200:
				raise CommandError(f'{url} returned HTTP {response.status_code}')
			path = output_path(public_dir, url)
			path.parent.mkdir(parents=True, exist_ok=True)
			path.write_bytes(response.content)
			self.stdout.write(f'  {url} -> {path.relative_to(public_dir)}')

		response = client.get('/this-page-does-not-exist/')
		if response.status_code != 404:
			raise CommandError(f'Expected a 404 page, got HTTP {response.status_code}')
		(public_dir / '404.html').write_bytes(response.content)

		static_files = sum(1 for p in (public_dir / 'static').rglob('*') if p.is_file())
		self.stdout.write(self.style.SUCCESS(
			f'Built {len(urls)} pages + 404.html and {static_files} static files into {public_dir}'))
