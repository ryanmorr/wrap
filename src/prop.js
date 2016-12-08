/**
 * Common variables
 */
const toString = {}.toString;

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
    let hash = 0;
    const type = getType(obj);
    switch (type) {
        case 'null':
        case 'undefined':
            return 0;
        case 'array':
            for (let i = 0, len = obj.length; i < len; i++) {
                hash += getHashCode(i + getHashCode(obj[i]));
            }
            return hash;
        case 'object':
            for (const prop in obj) {
                hash += getHashCode(prop + getHashCode(obj[prop]));
            }
            return hash;
        default:
            const str = obj.toString();
            for (let i = 0, len = str.length; i < len; i++) {
                hash = (((hash << 5) - hash) + str.charCodeAt(i)) & 0xFFFFFFFF;
            }
            return hash;
    }
}

/**
 * Wrap a variable to provide abstracted
 * utilities
 *
 * @param {*} value (optional)
 * @return {Function}
 * @api public
 */
export default function prop(value) {
    const listeners = [];

    /**
     * Get the value by passing no arguments,
     * or set the internal value by passing a
     * value
     *
     * @param {*} value (optional)
     * @return {*}
     * @api public
     */
    function prop(...args) {
        if (args.length) {
            value = args[0];
            listeners.forEach((fn) => fn(value));
        }
        return value;
    }

    /**
     * Get the type of the internal value
     *
     * @return {String}
     * @api public
     */
    prop.type = function type() {
        return getType(value);
    };

    /**
     * Check if the type of the internal value
     * matches the provided type
     *
     * @param {String} type
     * @return {Boolean}
     * @api public
     */
    prop.is = function is(type) {
        return this.type(value) === type.toLowerCase();
    };

    /**
     * Check if the internal value is strictly
     * equal to the provided object
     *
     * @param {*} obj
     * @return {Boolean}
     * @api public
     */
    prop.equals = function equals(obj) {
        return value === obj;
    };

    /**
     * Nullify the internal value
     *
     * @api public
     */
    prop.release = function release() {
        prop(null);
    };

    /**
     * Convert the internal value to a JSON
     * string
     *
     * @api public
     */
    prop.toJSON = function toJSON() {
        return JSON.stringify(value);
    };

    /**
     * Add a callback function to be invoked
     * everytime the internal value is changed
     *
     * @param {Function} fn
     * @api public
     */
    prop.observe = function observe(fn) {
        listeners.push(fn);
    };

    /**
     * Generate a unique hash code for the
     * internal value
     *
     * @return {Number}
     * @api public
     */
    prop.hashCode = function hashCode() {
        return getHashCode(value);
    };

    /**
     * Check if the internal value passes or
     * fails a condition
     *
     * @param {Function} fn
     * @return {Boolean}
     * @api public
     */
    prop.assert = function assert(fn) {
        return fn(value);
    };

    /**
     * Return an identical clone of the
     * internal value
     *
     * @return {Boolean}
     * @api public
     */
    prop.clone = function clone() {
        return JSON.parse(JSON.stringify(value));
    };

    /**
     * Log a message to the console
     *
     * @param {String} msg
     * @api public
     */
    prop.log = function log(msg) {
        /* eslint-disable no-console */
        if (console && console.log) {
            console.log(value, msg);
        }
        /* eslint-enable no-console */
    };

    /**
     * Throw an error
     *
     * @param {String} msg
     * @api public
     */
    prop.error = function error(msg) {
        throw new Error(msg);
    };

    /**
     * Return a string representation for the
     * internal value
     *
     * @return {String}
     * @api public
     */
    prop.toString = function toString() {
        return value.toString();
    };

    /**
     * Return an integer representation when
     * the internal value is converted to a
     * primitive
     *
     * @return {Number}
     * @api public
     */
    prop.valueOf = function valueOf() {
        return this.hashCode();
    };

    /**
     * Return the getter/setter function
     */
    return prop;
}
