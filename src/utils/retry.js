const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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