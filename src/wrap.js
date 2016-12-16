/**
 * Import dependencies
 */
import { getType, getHashCode, getIterator } from './util';

/**
 * Common variables
 */
const supportsIterator = typeof Symbol === 'function' && Symbol.iterator;

/**
 * Helper class that wraps a variable to provide
 * abstracted utilities
 *
 * @class Wrapper
 * @api public
 */
class Wrapper {

    /**
     * Instantiate the class and provide
     * the variable to wrap
     *
     * @param {*} value
     * @api public
     */
    constructor(value) {
        this.set(value);
        this.debugging = false;
    }

    /**
     * Set the internal value
     *
     * @param {*} value
     * @api public
     */
    set(value) {
        if (this.debugging) {
            debugger; // eslint-disable-line no-debugger
        }
        this.value = value;
        const type = this.type(value);
        if (supportsIterator
            && !(Symbol.iterator in this)
            && (type === 'array' || type === 'object')) {
            this[Symbol.iterator] = getIterator(value, type);
        }
        if ('listeners' in this) {
            this.listeners.forEach((fn) => fn(value));
        }
    }

    /**
     * Get the internal value
     *
     * @return {*}
     * @api public
     */
    get() {
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
    type() {
        return getType(this.value);
    }

    /**
     * Check if the type of the internal value
     * matches the provided type
     *
     * @param {String} type
     * @return {Boolean}
     * @api public
     */
    is(type) {
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
    equals(obj) {
        return this.value === obj;
    }

    /**
     * Nullify the internal value
     *
     * @api public
     */
    release() {
        this.set(null);
    }

    /**
     * Convert the internal value to a JSON
     * string
     *
     * @api public
     */
    toJSON() {
        return JSON.stringify(this.value);
    }

    /**
     * Add a callback function to be invoked
     * everytime the internal value is changed
     *
     * @param {Function} fn
     * @api public
     */
    observe(fn) {
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
    hashCode() {
        return getHashCode(this.value);
    }

    /**
     * Check if the internal value passes or
     * fails a condition
     *
     * @param {Function} fn
     * @return {Boolean}
     * @api public
     */
    assert(fn) {
        return fn(this.value);
    }

    /**
     * Return an identical clone of the
     * internal value
     *
     * @return {Boolean}
     * @api public
     */
    clone() {
        return JSON.parse(JSON.stringify(this.value));
    }

    /**
     * Log a message to the console
     *
     * @param {String} msg
     * @api public
     */
    log(msg) {
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
    error(msg) {
        throw new Error(msg);
    }

    /**
     * Turn debugging mode on and off
     *
     * @param {Boolean} debug
     * @api public
     */
    debug(debug = true) {
        this.debugging = debug;
    }

    /**
     * Return a string representation for the
     * internal value
     *
     * @return {String}
     * @api public
     */
    toString() {
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
    valueOf() {
        return this.hashCode();
    }
}

/**
 * Wrap a variable to provide abstracted
 * utilities
 *
 * @param {*} value (optional)
 * @return {Wrapper}
 * @api public
 */
export default function wrap(value) {
    return new Wrapper(value);
}
