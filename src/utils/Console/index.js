/* eslint-disable no-alert, no-console */

let Console;

if (process.env.NODE_ENV == 'development') {
    Console = console;
} else {
    /**
     * Disabble Console on production
     */
    Console = {};
    Object.keys(console).forEach(v => Console[v] = () => {});
}

export default Console;