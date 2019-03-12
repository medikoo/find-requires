"use strict";

var ensureString = require("es5-ext/object/validate-stringifiable-value")
  , esniff       = require("esniff/function")("require");

module.exports = function (code/*, options*/) {
	var options = Object(arguments[1]), deps = esniff(ensureString(code));
	deps.forEach(function (data) {
		var requirePath;
		try { requirePath = eval(data.raw); } catch (ignore) {}
		if (typeof requirePath === "number") requirePath = String(requirePath);
		if (typeof requirePath === "string") data.value = requirePath;
	});
	return options.raw ? deps : deps.map(function (dep) { return dep.value; }).filter(Boolean);
};
