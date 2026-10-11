"""Firebase Cloud Functions for www.theofekfoundation.org.

hangman: the Hangman challenge mode ("final round") API, served by a Firebase
Hosting rewrite at the old URL /games/api/get_hangman_word/ so the obfuscated
Hangman game script keeps working unchanged. The logic lives in hangman.py.
"""

import threading
import time

from firebase_functions import https_fn, options

import hangman as game

# The old site allowed one counted guess per 5 seconds per visitor
# (django-hitcount, HITCOUNT_KEEP_HIT_ACTIVE = 5 s). A rejected guess doesn't
# restart the wait. This is kept in memory, which works because max_instances=1
# means there's only ever one copy of the function. A cold start forgets it,
# which is harmless.
GUESS_INTERVAL_SECONDS = 5
_MAX_TRACKED_CLIENTS = 10_000
_last_guess = {}
_lock = threading.Lock()


def _client_ip(req):
	"""Best guess at the visitor's IP address.

	Behind Firebase Hosting the connection comes from Google's servers, so the
	visitor's address is in the forwarding headers. The visitor can't control
	the right-hand entries of X-Forwarded-For, so those are preferred.
	"""
	forwarded = [ip.strip() for ip in req.headers.get('X-Forwarded-For', '').split(',') if ip.strip()]
	if len(forwarded) >= 2:
		return forwarded[-2]
	if forwarded:
		return forwarded[0]
	return req.remote_addr or 'unknown'


def _allow_guess(client, now):
	with _lock:
		last = _last_guess.get(client)
		if last is not None and now - last < GUESS_INTERVAL_SECONDS:
			return False
		if len(_last_guess) >= _MAX_TRACKED_CLIENTS:
			for key, then in list(_last_guess.items()):
				if now - then >= GUESS_INTERVAL_SECONDS:
					del _last_guess[key]
		_last_guess[client] = now
		return True


@https_fn.on_request(
	region='us-central1',
	memory=options.MemoryOption.MB_256,
	max_instances=1,
	timeout_sec=10,
)
def hangman(req: https_fn.Request) -> https_fn.Response:
	if req.method != 'POST':
		return https_fn.Response('Method not allowed', status=405, headers={'Allow': 'POST'})
	if not _allow_guess(_client_ip(req), time.monotonic()):
		status, body = game.rate_limited()
	else:
		status, body = game.guess(req.get_data())
	return https_fn.Response(body, status=status, content_type='application/json',
		headers={'Cache-Control': 'no-store'})
