'use strict';

var isArray         = Array.isArray
  , parse           = JSON.parse
  , keys            = Object.keys
  , esprima         = require('esprima')

  , walker;

walker = function (ast) {
	var err, dep;
	if (!ast || (typeof ast !== 'object')) {
		return;
	}
	if (isArray(ast)) {
		ast.forEach(walker, this);
		return;
	}
	keys(ast).forEach(function (key) {
		if (key !== 'range') {
			walker.call(this, ast[key]);
		}
	}, this);
	if ((ast.type === 'CallExpression') && (ast.callee.type === 'Identifier') &&
			(ast.callee.name === 'require')) {
		dep = { at: this.code.indexOf('(', ast.range[0]) + 2 };
		dep.raw = this.code.slice(dep.at - 1, ast.range[1]);

		if ((ast.arguments.length === 1) && (ast.arguments[0].type === 'Literal')) {
			dep.value = String(ast.arguments[0].value);
		} else {
			if (ast.arguments.length === 1) {
				try {
					dep.value = String(Function("'use strict'; return " + dep.raw)());
				} catch (e) {}
			} else if (!ast.arguments.length) {
				dep.value = 'undefined';
			}
		}
		this.deps.push(dep);
	}
};

module.exports = function (code) {
	var ctx = { code: code, deps: [] };
	walker.call(ctx, esprima.parse(code, { range: true }));
	return ctx.deps;
};
