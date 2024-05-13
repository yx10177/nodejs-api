const hahowApi = require('../external-services/hahow-api');
const hahowValidator = require('../external-services/hahow-validator')
const { HttpError } = require('../utils/http-error');

module.exports = async (req, res, next) => {
    req.isAuthenticated = false;

    try {

        if (!hahowValidator.isNeedToCheckAuth(req.headers)) return next();

        const hahowAuthenticated = await hahowApi.getAuthenticated(req.headers);

        if (!hahowAuthenticated.ok) {
            const error = new HttpError(hahowAuthenticated.status, `hahow api: ${hahowAuthenticated.statusText}`);
            return next(error);
        }

        req.isAuthenticated = true;
        next();

    } catch (err) {

        next(err);
    }
};