// Accounts for the static site (Firebase Authentication + Firestore).
//
// Loaded as a module on every page by main_app_base.html. It:
// - shows the signed-in state: base.html's showSignedInName() toggles the
//   "signed-in" class on <html> and fills in #navbar-username / #greeting-username;
// - handles the navbar Logout link and the account pages' forms (templates/account/);
// - syncs signed-in users' game settings to Firestore at
//   users/{uid}/gameSettings/{gameName} (see firestore.rules). Settings are always
//   saved in the browser too (GameSettings.saveSettings in utils.js).

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
	createUserWithEmailAndPassword,
	getAdditionalUserInfo,
	getAuth,
	GithubAuthProvider,
	GoogleAuthProvider,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updateProfile,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

const FIRESTORE_SDK = 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

// Public web-app config (safe to publish; access is controlled by firestore.rules).
const app = initializeApp({
	apiKey: 'AIzaSyCcocTipd2Tvyr3AiW1DqmAot9pSthmD64',
	authDomain: 'theofekfoundation.firebaseapp.com',
	projectId: 'theofekfoundation',
	storageBucket: 'theofekfoundation.firebasestorage.app',
	messagingSenderId: '17171848498',
	appId: '1:17171848498:web:c565cc218b8a68a4be8b2b',
	measurementId: 'G-W2YLGQXGNB',
});
const auth = getAuth(app);

// Same keys as base.html (cached name) and utils.js (GameSettings.storageKey).
const NAME_KEY = 'auth:displayName';
const SETTINGS_PREFIX = 'gameSettings:';

const PROVIDERS = {
	google: () => new GoogleAuthProvider(),
	github: () => new GithubAuthProvider(),
};

const ERROR_MESSAGES = {
	'auth/invalid-credential': 'Wrong email or password.',
	'auth/wrong-password': 'Wrong email or password.',
	'auth/user-not-found': 'Wrong email or password.',
	'auth/invalid-email': "That email address doesn't look right.",
	'auth/missing-email': 'Please enter your email address.',
	'auth/missing-password': 'Please enter a password.',
	'auth/email-already-in-use': 'There is already an account with that email. Try logging in instead.',
	'auth/weak-password': 'Please choose a password with at least 6 characters.',
	'auth/too-many-requests': 'Too many attempts. Please wait a bit and try again.',
	'auth/user-disabled': 'This account has been disabled.',
	'auth/popup-blocked': 'Your browser blocked the sign-in window. Please allow popups for this site and try again.',
	'auth/account-exists-with-different-credential':
		'You already have an account with that email, using a different way of logging in. Please log in that way.',
	'auth/network-request-failed': 'Network error. Please check your connection and try again.',
	'auth/requires-recent-login': 'Please log out and log in again, then try once more.',
};
// Closing the sign-in window isn't an error worth showing.
const SILENT_ERRORS = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/user-cancelled']);

/* ---------- Signed-in state ---------- */

function nameOf(user) {
	return user.displayName || (user.email || '').split('@')[0] || 'friend';
}

function showUser(user) {
	const name = user ? nameOf(user) : null;
	try {
		if (name === null)
			localStorage.removeItem(NAME_KEY);
		else
			localStorage.setItem(NAME_KEY, name);
	} catch (e) {}
	window.showSignedInName(name);
}

let firstAuthState = true;
onAuthStateChanged(auth, (user) => {
	showUser(user);
	if (user && firstAuthState)
		refreshThisGamesSettings(user);
	firstAuthState = false;
});

/* ---------- Game settings sync (Firestore, loaded only when needed) ---------- */

let firestorePromise = null;
function firestore() {
	firestorePromise ??= import(FIRESTORE_SDK).then((fs) => ({ fs, db: fs.getFirestore(app) }));
	return firestorePromise;
}

function readLocalSettings(gameName) {
	try {
		return JSON.parse(localStorage.getItem(SETTINGS_PREFIX + gameName));
	} catch (e) {
		return null;
	}
}

function writeLocalSettings(gameName, settings) {
	try {
		localStorage.setItem(SETTINGS_PREFIX + gameName, JSON.stringify(settings));
	} catch (e) {}
}

async function saveRemoteSettings(user, gameName, settings) {
	const { fs, db } = await firestore();
	// Same shape as the localStorage copy (Firestore rejects undefined values).
	settings = JSON.parse(JSON.stringify(settings));
	await fs.setDoc(fs.doc(db, 'users', user.uid, 'gameSettings', gameName),
		{ settings, updatedAt: fs.serverTimestamp() });
}

function localSettingsGames() {
	const games = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key.startsWith(SETTINGS_PREFIX))
			games.push(key.slice(SETTINGS_PREFIX.length));
	}
	return games;
}

// Right after signing in: the account's saved settings replace this browser's.
// A brand-new account also adopts the settings this browser saved before
// (signed out). Existing accounts don't, so a shared browser can't leak one
// person's settings into someone else's account.
async function syncAllSettings(user, isNewAccount) {
	const { fs, db } = await firestore();
	const snapshot = await fs.getDocs(fs.collection(db, 'users', user.uid, 'gameSettings'));
	const inAccount = new Set();
	snapshot.forEach((doc) => {
		inAccount.add(doc.id);
		if (doc.data().settings)
			writeLocalSettings(doc.id, doc.data().settings);
	});
	if (!isNewAccount)
		return;
	await Promise.all(localSettingsGames().filter((gameName) => !inAccount.has(gameName)).map((gameName) => {
		const settings = readLocalSettings(gameName);
		return settings && saveRemoteSettings(user, gameName, settings).catch((e) => console.warn(e));
	}));
}

// Logging out also forgets this browser's copy of the settings (the account
// keeps them), so the next person on this browser starts from the defaults.
async function signOutAndForget() {
	try {
		localSettingsGames().forEach((gameName) => localStorage.removeItem(SETTINGS_PREFIX + gameName));
	} catch (e) {}
	await signOut(auth);
}

// On a game page, fetch the account's copy of this game's settings so that
// changes made on another device show up here on the next visit.
async function refreshThisGamesSettings(user) {
	const gameName = window.gameSettings && window.gameSettings._gameName;
	if (!gameName)
		return;
	try {
		const { fs, db } = await firestore();
		const doc = await fs.getDoc(fs.doc(db, 'users', user.uid, 'gameSettings', gameName));
		if (doc.exists() && doc.data().settings)
			writeLocalSettings(gameName, doc.data().settings);
	} catch (e) {
		console.warn('Could not load saved settings', e);
	}
}

// GameSettings.saveSettings (utils.js) fires this after saving in the browser.
document.addEventListener('gamesettingssaved', (event) => {
	const user = auth.currentUser;
	if (user)
		saveRemoteSettings(user, event.detail.gameName, event.detail.settings)
			.catch((e) => console.warn('Could not save settings to your account', e));
});

/* ---------- Navbar ---------- */

document.addEventListener('click', (event) => {
	if (event.target.closest('#logout-url')) {
		event.preventDefault();
		signOutAndForget().then(() => location.reload());
	}
});

/* ---------- Account pages ---------- */

function showError(form, error) {
	const box = form.querySelector('.errorlist');
	const code = error && error.code;
	if (SILENT_ERRORS.has(code))
		return;
	if (code)
		console.warn(error);
	box.textContent = typeof error === 'string' ? error
		: ERROR_MESSAGES[code] || `Something went wrong (${code || error}). Please try again.`;
	box.hidden = false;
}

function clearError(form) {
	const box = form.querySelector('.errorlist');
	box.textContent = '';
	box.hidden = true;
}

// Run an account action with the form's buttons disabled, showing any error.
async function submitting(form, action) {
	clearError(form);
	const buttons = form.parentElement.querySelectorAll('input[type=submit], button');
	buttons.forEach((b) => (b.disabled = true));
	try {
		await action();
	} catch (error) {
		showError(form, error);
	} finally {
		buttons.forEach((b) => (b.disabled = false));
	}
}

// Back to the page the user was on when they clicked Login/Register (the navbar
// stores its path in localStorage as 'path'; see theofekfoundation.js).
function returnToPreviousPage() {
	let path = '';
	try {
		path = JSON.parse(localStorage.getItem('path')) || '';
	} catch (e) {}
	path = String(path).replace(/^[/\\]+/, '');
	location.href = path.toLowerCase().startsWith('account/') ? '/' : '/' + path;
}

async function afterSignIn(user, isNewAccount) {
	try {
		await syncAllSettings(user, isNewAccount);
	} catch (e) {
		console.warn('Could not sync settings', e);
	}
	returnToPreviousPage();
}

function field(form, name) {
	return form.elements[name].value.trim();
}

const formHandlers = {
	async login_form(form) {
		const { user } = await signInWithEmailAndPassword(auth, field(form, 'email'), form.elements.password.value);
		await afterSignIn(user, false);
	},

	async register_form(form) {
		const username = field(form, 'username');
		if (!username)
			throw 'Please choose a username.';
		const { user } = await createUserWithEmailAndPassword(auth, field(form, 'email'), form.elements.password.value);
		await updateProfile(user, { displayName: username });
		showUser(user);
		await syncAllSettings(user, true).catch((e) => console.warn('Could not sync settings', e));
		// The page now shows the signed-in ("Welcome to the Foundation!") view.
	},

	async password_reset_form(form) {
		await sendPasswordResetEmail(auth, field(form, 'email'), { url: `${location.origin}/account/login/` });
		location.href = '/account/PasswordResetEmailSent/';
	},

	async username_form(form) {
		const username = field(form, 'username');
		if (!username)
			throw 'Please enter a username.';
		await updateProfile(auth.currentUser, { displayName: username });
		showUser(auth.currentUser);
		const done = form.querySelector('.success-message');
		if (done) {
			done.textContent = `You are reborn as ${username}!`;
			done.hidden = false;
		}
	},
};

for (const [formId, handler] of Object.entries(formHandlers)) {
	const form = document.getElementById(formId);
	if (!form)
		continue;
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		submitting(form, () => handler(form));
	});
}

// "Log in with Google/GitHub" buttons (account_form_base.html).
for (const button of document.querySelectorAll('[data-sign-in-provider]')) {
	button.addEventListener('click', (event) => {
		event.preventDefault();
		const form = document.querySelector('.account_form');
		submitting(form, async () => {
			const result = await signInWithPopup(auth, PROVIDERS[button.dataset.signInProvider]());
			await afterSignIn(result.user, Boolean(getAdditionalUserInfo(result)?.isNewUser));
		});
	});
}

// Prefill the username page with the current name.
const usernameInput = document.querySelector('#username_form input[name=username]');
if (usernameInput)
	auth.authStateReady().then(() => {
		if (auth.currentUser && !usernameInput.value)
			usernameInput.value = nameOf(auth.currentUser);
	});

// The logout page signs out as soon as it opens.
if (document.getElementById('logout-page'))
	auth.authStateReady().then(signOutAndForget);
