/**
 * pick()
 * from https://gist.github.com/bisubus/2da8af7e801ffd813fab7ac221aa7afc
 * @export
 * @param {Object} obj Object that needs to be filtered
 * @param {Array} whitelist Allowed keys
 * @returns {Object}
 */
export default function pick(obj, whitelist) {
    return Object.entries(obj)
        .filter(([key]) => whitelist.includes(key))
        .reduce((obj, [key, val]) => Object.assign(obj, {
            [key]: val
        }), {});
}