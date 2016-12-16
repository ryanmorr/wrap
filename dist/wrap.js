/*! wrap v0.1.0 | https://github.com/ryanmorr/wrap */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wrap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getType = getType;
exports.getHashCode = getHashCode;
exports.getIterator = getIterator;
/**
 * Common variables
 */
var toString = {}.toString;

/**
 * Get the internal [[Class]] of an object
 *
 * @param {*} obj
 * @return {String}
 * @api private
 */
function getType(obj) {
    return toString.call(obj).slice(8, -1).toLowerCase();
}

/**
 * Generate a hash code for an object
 * based on its value/indexed items/properties
 *
 * @param {*} obj
 * @return {Number}
 * @api private
 */
function getHashCode(obj) {
    var hash = 0;
    var type = getType(obj);
    switch (type) {
        case 'null':
        case 'undefined':
            return 0;
        case 'array':
            for (var i = 0, len = obj.length; i < len; i++) {
                hash += getHashCode(i + getHashCode(obj[i]));
            }
            return hash;
        case 'object':
            for (var prop in obj) {
                hash += getHashCode(prop + getHashCode(obj[prop]));
            }
            return hash;
        default:
            var str = obj.toString();
            for (var _i = 0, _len = str.length; _i < _len; _i++) {
                hash = (hash << 5) - hash + str.charCodeAt(_i) & 0xFFFFFFFF;
            }
            return hash;
    }
}

/**
 * Get an iterator function for an array or
 * object
 *
 * @param {Array|Object} value
 * @param {String} type
 * @return {Function}
 * @api private
 */
function getIterator(value, type) {
    if (type === 'array') {
        return function () {
            var index = 0;
            var length = value.length;
            return {
                next: function next() {
                    if (index < length) {
                        return { value: value[index++] };
                    }
                    return { done: true };
                }
            };
        };
    }
    return function () {
        var index = 0;
        var items = Object.keys(value);
        var length = items.length;
        return {
            next: function next() {
                if (index < length) {
                    var key = items[index++];
                    return { value: [key, value[key]] };
                }
                return { done: true };
            }
        };
    };
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


exports.default = wrap;

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Common variables
 */
var supportsIterator = typeof Symbol === 'function' && Symbol.iterator;

/**
 * Helper class that wraps a variable to provide
 * abstracted utilities
 *
 * @class Wrapper
 * @api public
 */

var Wrapper = function () {

    /**
     * Instantiate the class and provide
     * the variable to wrap
     *
     * @param {*} value
     * @api public
     */
    function Wrapper(value) {
        _classCallCheck(this, Wrapper);

        this.set(value);
        this.debugging = false;
    }

    /**
     * Set the internal value
     *
     * @param {*} value
     * @api public
     */


    _createClass(Wrapper, [{
        key: 'set',
        value: function set(value) {
            if (this.debugging) {
                debugger; // eslint-disable-line no-debugger
            }
            this.value = value;
            var type = this.type(value);
            if (supportsIterator && !(Symbol.iterator in this) && (type === 'array' || type === 'object')) {
                this[Symbol.iterator] = (0, _util.getIterator)(value, type);
            }
            if ('listeners' in this) {
                this.listeners.forEach(function (fn) {
                    return fn(value);
                });
            }
        }

        /**
         * Get the internal value
         *
         * @return {*}
         * @api public
         */

    }, {
        key: 'get',
        value: function get() {
            if (this.debugging) {
                debugger; // eslint-disable-line no-debugger
            }
            return this.value;
        }

        /**
         * Get the type of the internal value
         *
         * @return {String}
         * @api public
         */

    }, {
        key: 'type',
        value: function type() {
            return (0, _util.getType)(this.value);
        }

        /**
         * Check if the type of the internal value
         * matches the provided type
         *
         * @param {String} type
         * @return {Boolean}
         * @api public
         */

    }, {
        key: 'is',
        value: function is(type) {
            return this.type(this.value) === type.toLowerCase();
        }

        /**
         * Check if the internal value is strictly
         * equal to the provided object
         *
         * @param {*} obj
         * @return {Boolean}
         * @api public
         */

    }, {
        key: 'equals',
        value: function equals(obj) {
            return this.value === obj;
        }

        /**
         * Nullify the internal value
         *
         * @api public
         */

    }, {
        key: 'release',
        value: function release() {
            this.set(null);
        }

        /**
         * Convert the internal value to a JSON
         * string
         *
         * @api public
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            return JSON.stringify(this.value);
        }

        /**
         * Add a callback function to be invoked
         * everytime the internal value is changed
         *
         * @param {Function} fn
         * @api public
         */

    }, {
        key: 'observe',
        value: function observe(fn) {
            if (!('listeners' in this)) {
                this.listeners = [];
            }
            this.listeners.push(fn);
        }

        /**
         * Generate a unique hash code for the
         * internal value
         *
         * @return {Number}
         * @api public
         */

    }, {
        key: 'hashCode',
        value: function hashCode() {
            return (0, _util.getHashCode)(this.value);
        }

        /**
         * Check if the internal value passes or
         * fails a condition
         *
         * @param {Function} fn
         * @return {Boolean}
         * @api public
         */

    }, {
        key: 'assert',
        value: function assert(fn) {
            return fn(this.value);
        }

        /**
         * Return an identical clone of the
         * internal value
         *
         * @return {Boolean}
         * @api public
         */

    }, {
        key: 'clone',
        value: function clone() {
            return JSON.parse(JSON.stringify(this.value));
        }

        /**
         * Log a message to the console
         *
         * @param {String} msg
         * @api public
         */

    }, {
        key: 'log',
        value: function log(msg) {
            /* eslint-disable no-console */
            if (console && console.log) {
                console.log(this.value, msg);
            }
            /* eslint-enable no-console */
        }

        /**
         * Throw an error
         *
         * @param {String} msg
         * @api public
         */

    }, {
        key: 'error',
        value: function error(msg) {
            throw new Error(msg);
        }

        /**
         * Turn debugging mode on and off
         *
         * @param {Boolean} debug
         * @api public
         */

    }, {
        key: 'debug',
        value: function debug() {
            var _debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.debugging = _debug;
        }

        /**
         * Return a string representation for the
         * internal value
         *
         * @return {String}
         * @api public
         */

    }, {
        key: 'toString',
        value: function toString() {
            return this.value.toString();
        }

        /**
         * Return an integer representation when
         * the internal value is converted to a
         * primitive
         *
         * @return {Number}
         * @api public
         */

    }, {
        key: 'valueOf',
        value: function valueOf() {
            return this.hashCode();
        }
    }]);

    return Wrapper;
}();

/**
 * Wrap a variable to provide abstracted
 * utilities
 *
 * @param {*} value (optional)
 * @return {Wrapper}
 * @api public
 */


function wrap(value) {
    return new Wrapper(value);
}
module.exports = exports['default'];

},{"./util":1}]},{},[2])(2)
});

