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
 * Helper class that wraps a variable to provide
 * abstracted utilities
 *
 * @class Prop
 * @api public
 */
class Prop {

    /**
     * Instantiate the class and provide
     * the variable to wrap
     *
     * @param {*} value
     * @api public
     */
    constructor(value) {
        this.value = value;
        this.listeners = [];
    }

    /**
     * Set the internal value
     *
     * @param {*} value
     * @api public
     */
    set(...args) {
        if (args.length) {
            this.value = args[0];
            this.listeners.forEach((fn) => fn(this.value));
        }
    }

    /**
     * Get the internal value
     *
     * @return {*}
     * @api public
     */
    get(...args) {
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
 * @return {Prop}
 * @api public
 */
export default function prop(value) {
    return new Prop(value);
}
