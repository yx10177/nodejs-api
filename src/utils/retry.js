const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retries an asynchronous function with customizable retry conditions, number of retries, and delay between retries.
 *
 * @param {Function} asyncFn - The asynchronous function to retry.
 * @param {Object} options - The retry options.
 * @param {Function} [options.retryCondition] - The retry condition function that determines whether to retry based on the result of the asyncFn or the caught error. Defaults to a function that always returns false.
 * @param {number} [options.retries] - The maximum number of retries. Defaults to 5.
 * @param {number} [options.delayMs] - The delay in milliseconds between retries. Defaults to 1000.
 * @returns {Promise<any>} - A promise that resolves with the result of the asyncFn if the retry condition is not met within the specified number of retries, or rejects with the last caught error.
 */
const retry = async (asyncFn, { retryCondition = (r) => false, retries = 5, delayMs = 1000 } = {}) => {

    while (retries > 0) {
        try {
            const resource = await asyncFn();
            if (!retryCondition(resource)) {
                return resource;
            }
        } catch (err) {
            if (retries == 0 || !retryCondition(err)) {
                throw err;
            }
        }
        await delay(delayMs);
        retries--;
    }
};

module.exports = { retry };