"use strict";

const ensureString = require("es5-ext/object/validate-stringifiable-value")
    , esniff       = require("esniff/function")("require");

module.exports = function (code, options = {}) {
	options = Object(options);
	const deps = esniff(ensureString(code));
	deps.forEach(data => {
		let requirePath;
		try { requirePath = eval(data.raw); }
		catch (ignore) {}
		if (typeof requirePath === "number") requirePath = String(requirePath);
		if (typeof requirePath === "string") data.value = requirePath;
	});
	return options.raw ? deps : deps.map(dep => dep.value).filter(Boolean);
};
