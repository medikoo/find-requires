'use strict';

var value  = require('es5-ext/object/valid-value')
  , esniff = require('esniff/function')('require');

module.exports = function (code/*, options*/) {
	var options = Object(arguments[1])
	  , deps = esniff(String(value(code)));
	deps.forEach(function (data) {
		try {
			data.value = String(eval(data.raw));
		} catch (ignore) {}
	});
	return options.raw ? deps : deps.map(function (dep) {
		return dep.value;
	}).filter(Boolean);
};
