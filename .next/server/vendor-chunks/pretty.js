"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/pretty";
exports.ids = ["vendor-chunks/pretty"];
exports.modules = {

/***/ "(action-browser)/./node_modules/pretty/index.js":
/*!**************************************!*\
  !*** ./node_modules/pretty/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*!\n * pretty <https://github.com/jonschlinkert/pretty>\n *\n * Copyright (c) 2013-2015, 2017, Jon Schlinkert.\n * Released under the MIT License.\n */\n\n\n\nvar beautify = __webpack_require__(/*! js-beautify */ \"(action-browser)/./node_modules/js-beautify/js/index.js\");\nvar condense = __webpack_require__(/*! condense-newlines */ \"(action-browser)/./node_modules/condense-newlines/index.js\");\nvar extend = __webpack_require__(/*! extend-shallow */ \"(action-browser)/./node_modules/extend-shallow/index.js\");\nvar defaults = {\n  unformatted: ['code', 'pre', 'em', 'strong', 'span'],\n  indent_inner_html: true,\n  indent_char: ' ',\n  indent_size: 2,\n  sep: '\\n'\n};\n\nmodule.exports = function pretty(str, options) {\n  var opts = extend({}, defaults, options);\n  str = beautify.html(str, opts);\n\n  if (opts.ocd === true) {\n    if (opts.newlines) opts.sep = opts.newlines;\n    return ocd(str, opts);\n  }\n\n  return str;\n};\n\nfunction ocd(str, options) {\n  // Normalize and condense all newlines\n  return condense(str, options)\n    // Remove empty whitespace the top of a file.\n    .replace(/^\\s+/g, '')\n    // Remove extra whitespace from eof\n    .replace(/\\s+$/g, '\\n')\n\n    // Add a space above each comment\n    .replace(/(\\s*<!--)/g, '\\n$1')\n    // Bring closing comments up to the same line as closing tag.\n    .replace(/>(\\s*)(?=<!--\\s*\\/)/g, '> ');\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9wcmV0dHkvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViLGVBQWUsbUJBQU8sQ0FBQyw0RUFBYTtBQUNwQyxlQUFlLG1CQUFPLENBQUMscUZBQW1CO0FBQzFDLGFBQWEsbUJBQU8sQ0FBQywrRUFBZ0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGxhY2UtdG8tc3RhbmQvLi9ub2RlX21vZHVsZXMvcHJldHR5L2luZGV4LmpzP2U5YWYiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBwcmV0dHkgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L3ByZXR0eT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNSwgMjAxNywgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmVhdXRpZnkgPSByZXF1aXJlKCdqcy1iZWF1dGlmeScpO1xudmFyIGNvbmRlbnNlID0gcmVxdWlyZSgnY29uZGVuc2UtbmV3bGluZXMnKTtcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQtc2hhbGxvdycpO1xudmFyIGRlZmF1bHRzID0ge1xuICB1bmZvcm1hdHRlZDogWydjb2RlJywgJ3ByZScsICdlbScsICdzdHJvbmcnLCAnc3BhbiddLFxuICBpbmRlbnRfaW5uZXJfaHRtbDogdHJ1ZSxcbiAgaW5kZW50X2NoYXI6ICcgJyxcbiAgaW5kZW50X3NpemU6IDIsXG4gIHNlcDogJ1xcbidcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcHJldHR5KHN0ciwgb3B0aW9ucykge1xuICB2YXIgb3B0cyA9IGV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICBzdHIgPSBiZWF1dGlmeS5odG1sKHN0ciwgb3B0cyk7XG5cbiAgaWYgKG9wdHMub2NkID09PSB0cnVlKSB7XG4gICAgaWYgKG9wdHMubmV3bGluZXMpIG9wdHMuc2VwID0gb3B0cy5uZXdsaW5lcztcbiAgICByZXR1cm4gb2NkKHN0ciwgb3B0cyk7XG4gIH1cblxuICByZXR1cm4gc3RyO1xufTtcblxuZnVuY3Rpb24gb2NkKHN0ciwgb3B0aW9ucykge1xuICAvLyBOb3JtYWxpemUgYW5kIGNvbmRlbnNlIGFsbCBuZXdsaW5lc1xuICByZXR1cm4gY29uZGVuc2Uoc3RyLCBvcHRpb25zKVxuICAgIC8vIFJlbW92ZSBlbXB0eSB3aGl0ZXNwYWNlIHRoZSB0b3Agb2YgYSBmaWxlLlxuICAgIC5yZXBsYWNlKC9eXFxzKy9nLCAnJylcbiAgICAvLyBSZW1vdmUgZXh0cmEgd2hpdGVzcGFjZSBmcm9tIGVvZlxuICAgIC5yZXBsYWNlKC9cXHMrJC9nLCAnXFxuJylcblxuICAgIC8vIEFkZCBhIHNwYWNlIGFib3ZlIGVhY2ggY29tbWVudFxuICAgIC5yZXBsYWNlKC8oXFxzKjwhLS0pL2csICdcXG4kMScpXG4gICAgLy8gQnJpbmcgY2xvc2luZyBjb21tZW50cyB1cCB0byB0aGUgc2FtZSBsaW5lIGFzIGNsb3NpbmcgdGFnLlxuICAgIC5yZXBsYWNlKC8+KFxccyopKD89PCEtLVxccypcXC8pL2csICc+ICcpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/pretty/index.js\n");

/***/ })

};
;