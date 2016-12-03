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
     * Return the getter/setter function
     */
    return prop;
}
