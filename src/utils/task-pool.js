class TaskPool {
    constructor({ limit = 10 }) {
        this.limit = limit;
        this.pendingTasks = [];
        this.activeTasks = [];
        this.completed = [];
    }

    add(func) {
        this.pendingTasks.push(func);
    }

    _removeFromActive(promise) {
        this.activeTasks.splice(this.activeTasks.indexOf(promise), 1);
    }

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
