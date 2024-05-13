const hahowApi = require('../../src/external-services/hahow-api');
const hahowValidator = require('../../src/external-services/hahow-validator');
const { HttpError } = require('../../src/utils/http-error');
const checkHahowAuth = require('../../src/middlewares/check-hahow-auth');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/external-services/hahow-api');
jest.mock('../../src/external-services/hahow-validator');
jest.mock('../../src/utils/http-error');

describe('checkHahowAuth middleware', () => {
    const setupMockRequestResponse = () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = jest.fn();
        return { req, res, next };
    }

    test('should continue to next if the authentication need to check', async () => {
        const { req, res, next } = setupMockRequestResponse();
        hahowValidator.isNeedToCheckAuth.mockReturnValue(false);

        await checkHahowAuth(req, res, next);

        expect(req.isAuthenticated).toBeFalsy();
        expect(next).toHaveBeenCalledWith();  // should proceed without error
    });

    test('should trigger an HttpError when the auth api response is not OK', async () => {
        const { req, res, next } = setupMockRequestResponse();
        hahowValidator.isNeedToCheckAuth.mockReturnValue(true);
        hahowApi.getAuthenticated.mockResolvedValue({ ok: false, status: 401, statusText: "Unauthorized" });

        await checkHahowAuth(req, res, next);

        expect(HttpError).toHaveBeenCalledWith(401, "hahow api: Unauthorized");
        expect(next).toHaveBeenCalledWith(expect.any(HttpError));
    });

    test('should set isAuthenticated to true and proceed when authenticated successfully', async () => {
        
        const { req, res, next } = setupMockRequestResponse();
        hahowValidator.isNeedToCheckAuth.mockReturnValue(true);
        hahowApi.getAuthenticated.mockResolvedValue({ ok: true });

        await checkHahowAuth(req, res, next);

        expect(req.isAuthenticated).toBeTruthy();
        expect(next).toHaveBeenCalledWith();  // No errors, proceed to next middleware
    });

    test('should handle errors and pass them to next', async () => {
        const { req, res, next } = setupMockRequestResponse();
        hahowValidator.isNeedToCheckAuth.mockReturnValue(true);
        const error = new Error('API failure');
        hahowApi.getAuthenticated.mockRejectedValue(error);

        await checkHahowAuth(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });



});

