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
export function getType(obj) {
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
export function getHashCode(obj) {
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
 * Get an iterator function for an array or
 * object
 *
 * @param {Array|Object} value
 * @param {String} type
 * @return {Function}
 * @api private
 */
export function getIterator(value, type) {
    if (type === 'array') {
        return () => {
            let index = 0;
            const length = value.length;
            return {
                next() {
                    if (index < length) {
                        return {value: value[index++]};
                    }
                    return {done: true};
                }
            };
        };
    }
    return () => {
        let index = 0;
        const items = Object.keys(value);
        const length = items.length;
        return {
            next() {
                if (index < length) {
                    const key = items[index++];
                    return {value: [key, value[key]]};
                }
                return {done: true};
            }
        };
    };
}
