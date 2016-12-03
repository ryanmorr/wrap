/**
 * Wrap a variable to provide abstracted
 * utilities
 *
 * @param {*} value (optional)
 * @return {Function}
 * @api public
 */
export default function prop(value) {
    return function prop(...args) {
        if (args.length) {
            value = args[0];
        }
        return value;
    };
}
