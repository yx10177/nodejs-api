const { TaskPool } = require('../../src/utils/task-pool');

describe('TaskPool', () => {
    test('should handle task errors', async () => {
        const taskPool = new TaskPool({ limit: 2 });
        const mockTask = jest.fn(() => new Promise((_, reject) => setTimeout(() => reject('error'), 1000)));

        taskPool.add(mockTask);
        taskPool.add(mockTask);

        const { success, failure } = await taskPool.await();

        expect(success).toEqual([]);
        expect(failure).toEqual('error');
        expect(mockTask).toHaveBeenCalledTimes(2);
    });

    test('should handle successful tasks', async () => {
        const taskPool = new TaskPool({ limit: 2 });
        const mockTask = jest.fn(() => new Promise(resolve => setTimeout(() => resolve('success'), 1000)));

        taskPool.add(mockTask);
        taskPool.add(mockTask);

        const { success, failure } = await taskPool.await();

        expect(success).toEqual(['success', 'success']);
        expect(failure).toBeUndefined();
        expect(mockTask).toHaveBeenCalledTimes(2);
    });
});