"""Tests for hangman.py. Run with: python -m unittest discover -s functions"""

import json
import unittest
from datetime import datetime

import hangman

# The live old site revealed exactly these characters for this hour
# (checked 2026-10-11 16:00 PDT, before the migration).
KNOWN_HOUR = datetime(2026, 10, 11, 16, 0, 22, tzinfo=hangman.SERVER_TIME_ZONE)
KNOWN_CHARACTERS = ['\U000DFBAD', '\U0005B3A7', '\U000E78A0']


class FinalPhraseTest(unittest.TestCase):

	def test_matches_old_site(self):
		self.assertEqual(hangman.random_characters(KNOWN_HOUR, 3), KNOWN_CHARACTERS)
		c1, c2, c3 = KNOWN_CHARACTERS
		self.assertEqual(hangman.final_phrase(KNOWN_HOUR), f'Nothing {c1} gold {c2} can {c3} stay')

	def test_same_answer_all_hour(self):
		later = KNOWN_HOUR.replace(minute=59, second=59)
		self.assertEqual(hangman.final_phrase(later), hangman.final_phrase(KNOWN_HOUR))

	def test_changes_every_hour(self):
		next_hour = KNOWN_HOUR.replace(hour=17)
		self.assertNotEqual(hangman.final_phrase(next_hour), hangman.final_phrase(KNOWN_HOUR))


class GuessTest(unittest.TestCase):

	def guess(self, letter):
		status, body = hangman.guess(json.dumps({'letter': letter}).encode(), KNOWN_HOUR)
		return status, json.loads(body)

	def test_empty_guess_masks_everything_but_spaces(self):
		status, body = self.guess('')
		self.assertEqual(status, 200)
		self.assertEqual(body, {'active_word': '``````` ` ```` ` ``` ` ````', 'text_direction': 1})

	def test_guess_is_case_insensitive_on_the_hidden_side(self):
		status, body = self.guess('n')
		self.assertEqual(status, 200)
		self.assertEqual(body['active_word'], 'N````n` ` ```` ` ``n ` ````')

	def test_hidden_character_revealed(self):
		_, body = self.guess(KNOWN_CHARACTERS[1])
		self.assertEqual(body['active_word'][15], KNOWN_CHARACTERS[1])

	def test_hebrew_final_letters(self):
		self.assertEqual(hangman.normalize('ם'), 'מ')
		self.assertEqual(hangman.normalize('ך'), 'כ')
		self.assertEqual(hangman.normalize('A'), 'a')

	def test_letter_too_long(self):
		status, _ = self.guess('abcde')
		self.assertEqual(status, 403)

	def test_bad_requests(self):
		for raw in (b'not json', b'{}', b'[]', json.dumps({'letter': 5}).encode()):
			status, _ = hangman.guess(raw, KNOWN_HOUR)
			self.assertEqual(status, 400, raw)

	def test_rate_limited(self):
		status, body = hangman.rate_limited()
		self.assertEqual(status, 403)
		self.assertEqual(json.loads(body)['active_word'], 'I need to delay your guesses...')


if __name__ == '__main__':
	unittest.main()
