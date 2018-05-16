export class ScheduledTask {
  constructor(task, timeout) {
    this.completed = new Promise(resolve => this._resolve = resolve)
    this.timeoutId = setTimeout(
      () => {
        this._resolve()
        task()
      },
      timeout
    )
  }

  cancel() {
    clearTimeout(this.timeoutId)
  }
}

export class CompositeTask {
  constructor(tasks) {
    this.tasks = tasks
    this.completed = Promise.all(tasks.map(task => task.completed))
  }

  cancel() {
    this.tasks.forEach(task => task.cancel())
  }
}