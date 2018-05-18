export class RepeatingTask {
  constructor(
    private action: () => void,
    private interval: number
  ) {
    this.isRunning = false
  }

  public isRunning: boolean

  run() {
    this.isRunning = true
    this.intervalId = window.setInterval(this.action, this.interval)
  }

  private intervalId: number

  stop() {
    clearInterval(this.intervalId)
    this.isRunning = false
  }
}