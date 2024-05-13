/**
 * Represents a task pool that manages the execution of asynchronous tasks.
 */
class TaskPool {
    constructor({ limit = 10 }) {
        this.limit = limit;
        this.pendingTasks = [];
        this.activeTasks = [];
        this.completed = [];
    }

    /**
     * Adds a task to the task pool.
     * @param {Function} func - The task function to be added.
     */
    add(func) {
        this.pendingTasks.push(func);
    }

    /**
     * Removes the specified promise from the active tasks list.
     * @param {Promise} promise - The promise to be removed.
     * @private
     */
    _removeFromActive(promise) {
        this.activeTasks.splice(this.activeTasks.indexOf(promise), 1);
    }

    /**
     * Runs the tasks in the task pool.
     * @private
     */
    async _run() {
        while (this.pendingTasks.length || this.activeTasks.length) {
            if (this.activeTasks.length < this.limit && this.pendingTasks.length) {
                const task = this.pendingTasks.shift();
                const taskPromise = task();
                this.activeTasks.push(taskPromise);

                taskPromise.then(
                    result => {
                        this.completed.push(result);
                        this._removeFromActive(taskPromise);
                    },
                    error => {
                        this._removeFromActive(taskPromise);
                    }
                );
            }

            if (this.activeTasks.length >= this.limit || !this.pendingTasks.length) {
                await Promise.race(this.activeTasks);
            }
        }
    }

    /**
     * Executes the tasks in the task pool and waits for their completion.
     * @returns {Promise} A promise that resolves to an object containing the success and failure results.
     */
    async await() {
        let result = { success: [], failure: undefined };
        try {
            await this._run();
            result.success = this.completed;
        } catch (err) {
            result.failure = err;
        }
        return result;
    }
}

module.exports = { TaskPool };
