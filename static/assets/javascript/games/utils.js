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

/**
 * Function that checks if two arrays are equal
 * @param  {Object} array1  one of the arrays to test
 * @param  {Object} array2  the other array to test
 * @return {boolean}        returns true if arrays are equal
 */
function arraysEqual(array1, array2) {
	if (!Array.isArray(array1) && !Array.isArray(array2))
		return array1 === array2;

	if (array1.length !== array2.length)
		return false;

	for (var i = 0, len = array1.length; i < len; i++)
		if (!arraysEqual(array1[i], array2[i]))
			return false;

	return true;
}

function resizeGameSettingsTable() {
	let gameSettingsTable = getElemId('game-settings-table'),
	    menuHeight = getElemHeight(
			getElemId('game-settings-menu'))
	    	- getElemHeight(gameSettingsTable),
	    tableHeight = getElemHeight(contentWrapper) - menuHeight;

	if (tableHeight <= 25)
		tableHeight = 25;
	setElemStyle(gameSettingsTable, 'maxHeight',
		tableHeight - 1 + "px");
	setElemStyle(gameSettingsTable.children[0], 'maxHeight',
		tableHeight - 1 + "px");
	centerVertically(getElemId('game-settings-menu'));

	setElemStyle(gameSettingsTable.children[0], 'width',
		getElemProperty(gameSettingsTable.children[0].children[0], 'width') + "px");
}

var gameSettingsVisible = false;

function showSettingsForm() {
	if (gameSettingsVisible)
		hideSettingsForm();
	else {
		gameSettingsVisible = true;
		setElemStyle(getElemId('game-settings-menu'), 'z-index', 100);
		addClassElem(getElemId('game-settings-menu'), 'visible');
	}
}

function hideSettingsForm(callback) {
	gameSettingsVisible = false;
	callback = callback || function () {
		if (!hasClassElem(getElemId('game-settings-menu'), 'visible'))
			setElemStyle(getElemId('game-settings-menu'), 'z-index', -1);
		getElemId('game-settings-menu').removeEventListener('webkitTransitionEnd', callback);
	};
	getElemId('game-settings-menu').addEventListener('webkitTransitionEnd', callback);
	removeClassElem(getElemId('game-settings-menu'), 'visible');
	getElemId('game-settings-menu').addEventListener('webkitTransitionStart', callback);
}
