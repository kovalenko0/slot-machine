export interface Task {
  cancel(): void
  completed: Promise<void>
}

export class ScheduledTask implements Task {
  constructor(task: () => void, timeout: number) {
    this.completed = new Promise(resolve => this._resolve = resolve)
    this.timeoutId = window.setTimeout(
      () => {
        this._resolve()
        task()
      },
      timeout
    )
  }

  public completed: Promise<void>

  private timeoutId: number

  private _resolve: () => void

  public cancel() {
    clearTimeout(this.timeoutId)
  }
}

export class CompositeTask implements Task {
  constructor(
    private tasks: ScheduledTask[]
  ) {
    this.completed = Promise
      .all(tasks.map(task => task.completed))
      .then(() => {}) // changes Promise type from void[] to void
  }

  public completed: Promise<void>

  public cancel() {
    this.tasks.forEach(task => task.cancel())
  }
}