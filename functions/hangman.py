"""Hangman challenge mode (the "final round"), ported from the old Django site.

The answer is "Nothing ? gold ? can ? stay", where each ? is a character drawn
from every code point between U+0020 and U+10FFFF, and the draw changes every
hour. This reproduces the old Python 2 code (settings.FINAL_HANGMAN and
games.views.get_hangman_word) exactly:

* Same seed: (hour * 1235) ^ day ^ (year * 993678149), using the old server's
  clock. Django set the process time zone to settings.TIME_ZONE ('PST8PDT'), so
  that is US Pacific time.
* Integer seeds and random.random() give the same sequence in Python 2 and 3.
* Python 2's random.choice(seq) was seq[int(random() * len(seq))]; Python 3's
  choice() draws differently, so the old formula is used directly. The old
  alphabet was a 16 MB tuple of every code point from U+0020 in order, so
  alphabet[i] is just chr(0x20 + i).

This module has no Firebase dependencies so it can be tested locally.
"""

import json
import random
from datetime import datetime
from zoneinfo import ZoneInfo

# The old server's local time (Django TIME_ZONE = 'PST8PDT', which is now an
# alias of America/Los_Angeles in the tz database).
SERVER_TIME_ZONE = ZoneInfo('America/Los_Angeles')

TEXT_DIRECTION = 1  # left-to-right
FIRST_CODE_POINT = 0x20
ALPHABET_SIZE = 0x110000 - FIRST_CODE_POINT  # 1,114,080 code points
PLACEHOLDER = '`'
MAX_LETTER_LENGTH = 4

RATE_LIMITED_MESSAGE = 'I need to delay your guesses...'
LETTER_TOO_LONG_MESSAGE = "come on, don't be *too* bad"

# Hebrew final letters count as their regular forms.
_HEBREW_FINAL_FORMS = {'ם': 'מ', 'ן': 'נ', 'ץ': 'צ', 'ף': 'פ', 'ך': 'כ'}


def random_characters(now, count):
	"""Returns the `count` hidden characters for the hour of `now` (old-server local time)."""
	rng = random.Random((now.hour * 1235) ^ now.day ^ (now.year * 993678149))
	return [chr(FIRST_CODE_POINT + int(rng.random() * ALPHABET_SIZE)) for _ in range(count)]


def final_phrase(now=None):
	"""Returns this hour's answer."""
	if now is None:
		now = datetime.now(SERVER_TIME_ZONE)
	c1, c2, c3 = random_characters(now, 3)
	return 'Nothing ' + c1 + ' gold ' + c2 + ' can ' + c3 + ' stay'


def normalize(s):
	"""Lowercases `s` and maps Hebrew final letters to their regular forms."""
	for final, regular in _HEBREW_FINAL_FORMS.items():
		s = s.replace(final, regular)
	return s.lower()


def reveal(letter, phrase):
	"""Masks every character of `phrase` except whitespace and matches of `letter`."""
	return ''.join(c if normalize(c) == letter or c.isspace() else PLACEHOLDER for c in phrase)


def _body(active_word):
	return json.dumps({'active_word': active_word, 'text_direction': TEXT_DIRECTION})


def guess(raw_body, now=None):
	"""Handles one POSTed guess, like the old get_hangman_word view.

	The request body is JSON {"letter": "<guess>"} (the game sends "" to get the
	fully masked phrase). Returns (http_status, json_text). Rate limiting is the
	caller's job, since it needs the client's address.
	"""
	try:
		letter = json.loads(raw_body)['letter']
	except (ValueError, TypeError, KeyError):
		return 400, _body('')
	if not isinstance(letter, str):
		return 400, _body('')
	if len(letter) > MAX_LETTER_LENGTH:
		return 403, _body(LETTER_TOO_LONG_MESSAGE)
	return 200, _body(reveal(letter, final_phrase(now)))


def rate_limited():
	"""The response for a guess that came too soon after the previous one."""
	return 403, _body(RATE_LIMITED_MESSAGE)
