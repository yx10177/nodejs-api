const { retry } = require('../../src/utils/retry');

describe('retry', () => {
    test('should return the resource if no retry condition is met', async () => {
        const expectResult = { code: 200 };
        const asyncFn = jest.fn().mockResolvedValue(expectResult);

        const result = await retry(asyncFn);

        expect(result).toEqual(expectResult);
    });

    test('should throw an error if the async function throws an error and no retry condition is met', async () => {
        const asyncFn = jest.fn().mockRejectedValue(new Error('Error'));
        await expect(retry(asyncFn)).rejects.toThrow('Error');
    });

    test('should retry the async function until a custom retry condition is met', async () => {
        const asyncFn = jest.fn()
            .mockResolvedValueOnce({ code: 1000, message: 'Error' })
            .mockResolvedValueOnce({ code: 1000, message: 'Error' })
            .mockResolvedValue({ code: 200 });
        const retryCondition = r => r.message && r.message.includes('Error');

        const result = await retry(asyncFn, { retryCondition });

        expect(result).toEqual({ code: 200 });
        expect(asyncFn).toHaveBeenCalledTimes(3);
    });
});