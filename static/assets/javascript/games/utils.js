class GameSettings {
	constructor(gameName, settings) {
		this._gameName = gameName;
		this._settings = {};
		this.setSettings(settings);
	}

	setSettings(settings) {
		for (let key in settings)
			this._settings[key] = settings[key];
		return this._settings;
	}

	getSettings() {
		return this._settings;
	}

	set(key, val) {
		this._settings[key] = val;
		return this._settings[key];
	}

	get(key) {
		return this._settings[key];
	}

	getOrSet(key, val) {
		if (typeof val === 'object')
			val = val[key];
		if (this.get(key))
			return castType(this.get(key), val);
		return this.set(key, val);
	}

	saveSettings(success, failure) {
		$.post({
			url: "/games/api/save_settings/",
			data: {'settings': JSON.stringify(convertKeysObject(this._settings, true))},
			dataType: "json",
			success: function(r) {
				if (success)
					success(r);
			},
			error: function(e) {
				if (failure)
					failure(e);
			}
		});
	}
}

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