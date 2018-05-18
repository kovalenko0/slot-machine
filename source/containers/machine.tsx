import * as React from "react";
import * as ReactDOM from "react-dom";
import { ScheduledTask, CompositeTask, Task } from '../scheduled-task'
import { RepeatingTask } from "../repeating-task";
import { MachineView, Props as MachineViewProps } from '../components/machine'
import { randomIntInRange } from "../random-int-in-range";

export interface State {
  wheels: Wheel[],
  resultMessage: string,
  reward: number
}

export interface Wheel {
  id: number,
  isSpinning: boolean,
  currentSymbol: number
}

export interface Props {
  render: (props: MachineViewProps) => JSX.Element
}

export class Machine extends React.Component<Props, State> {
  public state: State = {
    wheels: [],
    resultMessage: null,
    reward: null
  }

  private rewardRules = [
    {
      applies: (wheels: Wheel[]) => {
        const result = wheels.reduce(
          (result, wheel) => {
            if (result.symbol == null) {
              result.symbol = wheel.currentSymbol
            } else {
              result.allEqual = result.allEqual && result.symbol === wheel.currentSymbol
            }
            return result
          },
          {
            symbol: null,
            allEqual: true
          }
        )

        return result.allEqual
      },
      reward: 100,
      message: 'All symbols are equal'
    },
    {
      applies: (wheels: Wheel[]) => {
        const requiredAmountOfSameSymbolsInRow = 2
        const result = wheels.reduce(
          (result, wheel) => {
            if (result.countOfSameSymbolsInRow === requiredAmountOfSameSymbolsInRow) {
              return result
            } else {
              if (result.symbol === wheel.currentSymbol) {
                result.countOfSameSymbolsInRow += 1
              } else {
                result.symbol = wheel.currentSymbol
                result.countOfSameSymbolsInRow = 1
              }
              return result
            }
          },
          {
            symbol: null,
            countOfSameSymbolsInRow: 0
          }
        )
        return result.countOfSameSymbolsInRow === requiredAmountOfSameSymbolsInRow
      },
      reward: 20,
      message: `You've got 2 of the same symbol in a row`
    },
    {
      applies: (wheels: Wheel[]) => {
        const requiredAmountOfSameSymbol = 2
        const symbolFrequencyMap = wheels.reduce(
          (map, wheel) => {
            map[wheel.currentSymbol] = (map[wheel.currentSymbol] || 0) + 1
            return map
          },
          {} as any
        )
        return Object
          .keys(symbolFrequencyMap)
          .some(symbolKey => symbolFrequencyMap[symbolKey] === requiredAmountOfSameSymbol)
      },
      reward: 10,
      message: `You've got 2 of the same symbol`
    }
  ]

  private noRewardMessage = `You've won nothing`

  private autoStartTimeout = 5000

  private autoStopTimeout = 10000

  private wheelsCount = 3

  private wheelSymbolCount = 4

  private wheelRotationDuration = 50

  private wheelStoppingDelay = 500

  private autoStartTask: Task

  private stoppingTask: Task

  private autoStopTask: Task

  private spinningTask: RepeatingTask

  public componentWillMount() {
    const wheels: Wheel[] = []

    for (let i = 0; i < this.wheelsCount; i++) {
      wheels.push({
        id: i,
        currentSymbol: randomIntInRange(0, this.wheelSymbolCount - 1),
        isSpinning: false
      })
    }

    this.setState({
      wheels
    })

    this.autoStartTask = new ScheduledTask(() => this.startSpinning(), this.autoStartTimeout)
    this.stoppingTask = new ScheduledTask(() => {}, 0)
    this.spinningTask = new RepeatingTask(() => this.spinWheels(), this.wheelRotationDuration)
    this.spinningTask.run()
  }

  private startSpinning() {
    this.autoStartTask.cancel()
    this.stoppingTask.cancel()
    this.autoStopTask = new ScheduledTask(
      () => this.stopSpinning(),
      this.autoStopTimeout
    )
    this.setState({
      resultMessage: null,
      reward: null,
      wheels: this.state.wheels.map(wheel => ({
        ...wheel,
        isSpinning: true
      }))
    })
  }

  private stopSpinning() {
    this.autoStopTask.cancel()
    this.stoppingTask = new CompositeTask(
      this.state.wheels.map((wheel, index) => {
        const delay = index * this.wheelStoppingDelay
  
        return new ScheduledTask(
          () => this.stopWheel(wheel.id),
          randomIntInRange(delay * 0.75, delay * 1.25)
        )
      })
    )
    this.stoppingTask.completed.then(() => {
      this.setState(this.getResults(this.state.wheels))
    })
  }

  private stopWheel(id: number) {
    this.setState({
      wheels: this.state.wheels.map(wheel => {
        if (wheel.id == id) {
          return {
            ...wheel,
            isSpinning: false
          }
        } else {
          return wheel
        }
      })
    })
  }

  private spinWheels() {
    this.setState({
      wheels: this.state.wheels.map(wheel => {
        if (wheel.isSpinning) {
          return {
            ...wheel,
            currentSymbol:
              wheel.currentSymbol === this.wheelSymbolCount - 1
                ? 0
                : wheel.currentSymbol + 1
          }
        } else {
          return wheel
        }
      })
    })
  }

  public getResults(wheels: Wheel[]) {
    const applicableRule = this.rewardRules.find(rule => rule.applies(wheels))
    if (applicableRule != null) {
      return {
        resultMessage: applicableRule.message,
        reward: applicableRule.reward
      }
    } else {
      return {
        resultMessage: this.noRewardMessage,
        reward: 0
      }
    }
  }

  public componentWillUnmount() {
    this.spinningTask.stop()
    this.autoStartTask.cancel()
    this.stoppingTask.cancel()  
    this.autoStopTask.cancel()
  }

  public render() {
    return this.props.render({
      wheels: this.state.wheels,
      isSpinning: this.state.wheels.some(wheel => wheel.isSpinning),
      resultMessage: this.state.resultMessage,
      reward: this.state.reward,
      onStartClick: () => this.startSpinning(),
      onStopClick: () => this.stopSpinning(),
    })
  }
}