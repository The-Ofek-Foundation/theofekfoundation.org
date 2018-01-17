/**
 * @typedef {Array.<string, *>} dictionary
 */

class GameSettings {

	/**
	 * Initializes the GameSettings class with gameName and game settings.
	 * @param  {string}     gameName the name of the game
	 * @param  {dictionary} settings a dictionary of key-value pairs containing settings
	 */
	constructor(gameName, settings) {
		this._gameName = gameName;
		this._settings = {};
		if (settings)
			this.setSettings(settings);
	}

	/**
	 * Sets the settings for this object given a dictionary of key-value pairs
	 * @param {dictionary} settings a dictionary of key-value pairs containing settings
	 */
	setSettings(settings) {
		for (let key in settings)
			this.set(key, settings[key]);
		return this._settings;
	}

	/**
	 * Returns the settings of this object
	 * @return {dictionary} a dictionary of key-value pairs containing settings
	 */
	getSettings() {
		return this._settings;
	}

	/**
	 * Updates a setting given a key-value pair
	 * @param {string} key the key to add to
	 * @param {*}      val the value to add
	 */
	set(key, val) {
		this._settings[key] = val;
		return this._settings[key];
	}

	/**
	 * Gets the item from dictionary at specific key
	 * @param  {string} key the key for the value
	 * @return {*}          the value to get
	 */
	get(key) {
		return this._settings[key];
	}

	/**
	 * Gets key value if in settings, or sets value and returns it if already present.
	 * @param  {string} key the key for the value
	 * @param  {*}      val the value to set if not already present
	 * @return {*}          the final value
	 */
	getOrSet(key, val) {
		if (key in this._settings)
			return castType(this.get(key), val);
		return this.set(key, val);
	}

	/**
	 * Gets key value if in settings, or sets value and returns it if already present from dictionary. Used as a shorthand, ex:
	 *
	 * const DEFAULT_SETTINGS = {'aiTurn': false};
	 * aiTurn = getOrSetDict('aiTurn', DEFAULT_SETTINGS);
	 *
	 * instead of:
	 * aiTurn = getOrSet('aiTurn', DEFAULT_SETTINGS['aiTurn']);
	 *
	 * @param  {string}     key the key for the value
	 * @param  {dictionary} val a dictionary containing the value to set if not already present.
	 * @return {*}              the final value
	 */
	getOrSetDict(key, val) {
		if (typeof val === 'object')
			val = val[key];
		return getOrSet(key, val);
	}

	/**
	 * @callback success
	 * @param {Object} s successful response object
	 */

	/**
	 * @callback failure
	 * @param {Object} e error object
	 */

	/**
	 * Saves the current settings, associating with the user account.
	 * @param  {success} success callback that handles success
	 * @param  {failure} failure callback that handles error
	 */
	saveSettings(success, failure) {
		var request = new XMLHttpRequest();
		request.open('POST', '/games/api/save_settings/', true);
		request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		request.onreadystatechange = function() {
			if (request.readyState === 4)
				if (request.status === 200 && typeof success === 'function')
					success();
				else if (typeof failure === 'function')
					failure();
		}
		request.send(JSON.stringify(convertKeysObject(this._settings, true)));
	}
}

function resizeSettingsTable() {
	let settingsTable = getElemId('settings-table'),
	    menuHeight = getElemHeight(
			getElemId('settings-menu'))
	    	- getElemHeight(settingsTable),
	    tableHeight = getElemHeight(contentWrapper) - menuHeight;

	if (tableHeight <= 25)
		tableHeight = 25;
	setElemStyle(settingsTable, 'maxHeight',
		tableHeight - 1 + "px");
	setElemStyle(settingsTable.children[0], 'maxHeight',
		tableHeight - 1 + "px");
	centerVertically(getElemId('settings-menu'));

	setElemStyle(settingsTable.children[0], 'width',
		getElemProperty(settingsTable.children[0].children[0], 'width') + "px");
}

var settingsVisible = false;

function showSettingsForm() {
	if (settingsVisible)
		hideSettingsForm();
	else {
		settingsVisible = true;
		setElemStyle(getElemId('settings-menu'), 'z-index', 100);
		addClassElem(getElemId('settings-menu'), 'visible');
	}
}

function hideSettingsForm(callback) {
	let settingsMenu = getElemId('settings-menu');
	settingsVisible = false;
	callback = callback || function () {
		if (!hasClassElem(settingsMenu, 'visible'))
			setElemStyle(settingsMenu, 'z-index', -1);
		settingsMenu.removeEventListener('webkitTransitionEnd', callback);
	};
	settingsMenu.addEventListener('webkitTransitionEnd', callback);
	removeClassElem(settingsMenu, 'visible');
	settingsMenu.addEventListener('webkitTransitionStart', callback);
}

if (getElemId('done'))
	getElemId('done').addEventListener('click', function (event) {
		var settings = getNewSettings();
		gameSettings.setSettings(settings);
		hideSettingsForm();
		newGame();
	});

if (getElemId('cancel'))
	getElemId('cancel').addEventListener('click', function (event) {
		hideSettingsForm();
		populateSettingsForm(gameSettings.getSettings());
	});

if (getElemId('save'))
	getElemId('save').addEventListener('click', function (event) {
		var settings = getNewSettings();
		gameSettings.setSettings(settings);
		gameSettings.saveSettings(settings);
		hideSettingsForm();
		newGame();
	});
