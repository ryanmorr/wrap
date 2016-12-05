/**
 * Common variables
 */
const toString = {}.toString;

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
        return toString.call(value).slice(8, -1).toLowerCase();
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
        value = null;
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
     * Return the getter/setter function
     */
    return prop;
}
