const heroesController = require('../../src/controllers/heroes');
const hahowApi = require('../../src/external-services/hahow-api');
const { TaskPool } = require('../../src/utils/task-pool');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/external-services/hahow-api');
jest.mock('../../src/utils/task-pool');

describe('GET /heroes', () => {

    const setupMockRequestResponse = (isAuthenticated = false) => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/',
        });
        req.isAuthenticated = isAuthenticated;
        const res = httpMocks.createResponse();
        const next = jest.fn();
        return { req, res, next };
    }

    test('should send all heroes when not authenticated', async () => {
        const { req, res, next } = setupMockRequestResponse();
        const mockHeroes = [{ id: 1, name: 'Hero1' }, { id: 2, name: 'Hero2' }];
        hahowApi.getHeroes.mockResolvedValue(mockHeroes);

        await heroesController.getHeroes(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockHeroes);
        expect(next).not.toHaveBeenCalled();
    });

    test('should send enhanced heroes when authenticated', async () => {
        const { req, res, next } = setupMockRequestResponse(true);
        const mockHeroes = [{ id: 1, name: 'Hero1' }, { id: 2, name: 'Hero2' }];
        const addHeroProfile = hero => ({ ...hero, profile: {} });
        hahowApi.getHeroes.mockResolvedValue(mockHeroes);
        TaskPool.mockImplementation(() => ({
            add: jest.fn(),
            await: jest.fn().mockResolvedValue({ success: mockHeroes.map(addHeroProfile), failure: null })
        }));

        await heroesController.getHeroes(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockHeroes.map(addHeroProfile));
        expect(next).not.toHaveBeenCalled();
    });

    test('should return 404 if no heroes are found', async () => {
        const { req, res, next } = setupMockRequestResponse();
        hahowApi.getHeroes.mockResolvedValue(null);

        await heroesController.getHeroes(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ error: "Heroes not found" });
        expect(next).not.toHaveBeenCalled();
    });

    test('should handle errors by calling next with the error', async () => {
        const { req, res, next } = setupMockRequestResponse();
        const error = new Error('Something went wrong');
        hahowApi.getHeroes.mockRejectedValue(error);

        await heroesController.getHeroes(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('GET /heroes/:heroId', () => {
    
    const setupMockRequestResponse = (heroId, isAuthenticated = false) => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: `/heroes/${heroId}`,
            params: { heroId },
        });
        req.isAuthenticated = isAuthenticated;
        const res = httpMocks.createResponse();
        const next = jest.fn();
        return { req, res, next };
    }

    test('should return 400 if heroId is not provided', async () => {
        const { req, res, next } = setupMockRequestResponse(undefined);

        await heroesController.getHero(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ error: "Missing heroId parameter" });
    });

    test('should return 404 if hero is not found', async () => {
        const { req, res, next } = setupMockRequestResponse('1');
        hahowApi.getHero.mockResolvedValue(null);

        await heroesController.getHero(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ error: "Hero not found" });
    });

    test('should send hero data when not authenticated', async () => {
        const { req, res, next } = setupMockRequestResponse('1');
        const mockHero = { id: '1', name: 'HeroName' };
        hahowApi.getHero.mockResolvedValue(mockHero);

        await heroesController.getHero(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockHero);
    });

    test('should send enhanced hero data when authenticated', async () => {
        const { req, res, next } = setupMockRequestResponse('1', true);
        const mockHero = { id: '1', name: 'HeroName' };
        const mockProfile = { str: 1, int: 1, agi: 1, luk: 1 };
        hahowApi.getHero.mockResolvedValue(mockHero);
        hahowApi.getHeroProfile.mockResolvedValue(mockProfile); // simulate enhanced profile

        await heroesController.getHero(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual({ ...mockHero, profile: mockProfile });
    });

    test('should handle errors and pass them to next', async () => {
        const { req, res, next } = setupMockRequestResponse('1');
        const error = new Error('API failure');
        hahowApi.getHero.mockRejectedValue(error);

        await heroesController.getHero(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

