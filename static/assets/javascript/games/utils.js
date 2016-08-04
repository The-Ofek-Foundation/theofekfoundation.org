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