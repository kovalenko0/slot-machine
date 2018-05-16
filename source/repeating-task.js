export class RepeatingTask {
  constructor(action, interval) {
    this.action = action
    this.interval = interval
    this.isRunning = false
  }

  run() {
    this.isRunning = true
    this.intervalId = setInterval(this.action, this.interval)
  }

  stop() {
    clearInterval(this.intervalId)
    this.isRunning = false
  }
}